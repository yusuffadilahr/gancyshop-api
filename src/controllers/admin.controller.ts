import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { imageKit } from "../utils/imageKit";
import { readFileSync, rmSync } from "fs";
import { Prisma } from "@prisma/client";
import type { FolderObject } from "imagekit/dist/libs/interfaces";
import { hashPassword } from "../utils/hashPassword";
import dayjs from "../utils/dayjs";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagesUploaded =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  try {
    const userId = req.user?.id;
    const {
      name,
      description,
      price,
      isActive,
      stock,
      weightGram,
      categoryId,
    } = req.body;

    if (!name || !description || !price || !stock || !weightGram || !categoryId)
      throw { msg: "Harap diisi terlebih dahulu", status: 400 };

    if (!imagesUploaded.images || imagesUploaded.images.length === 0)
      throw { msg: "File tidak ditemukan", status: 404 };

    const fileBuffer = readFileSync(imagesUploaded.images[0].path);
    if (!!fileBuffer) {
      const fileUploadImageKit = await imageKit.upload({
        file: fileBuffer,
        fileName: imagesUploaded.images[0].filename,
        folder: "/products/body-sparepart",
      });

      if (!fileUploadImageKit) throw { msg: "Gagal upload data", status: 400 };
      const uploadedProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl: fileUploadImageKit.url,
          isActive: isActive === "false" ? false : true,
          stock: Number(stock),
          weightGram: Number(weightGram),
          ownerId: Number(userId),
          categoryId: Number(categoryId),
        },
      });

      if (!uploadedProduct) throw { msg: "Gagal membuat produk", status: 400 };
      rmSync(imagesUploaded?.images?.[0].path);
    }

    res.status(200).json({
      data: {},
      error: false,
      message: "Berhasil mengupload produk!",
    });
  } catch (error) {
    rmSync(imagesUploaded.images[0].path);
    next(error);
  }
};

export const getAllDataProductAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search = "", limit = "5", page = "1" } = req.query;

    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    let whereClause: Prisma.productWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause = {
        AND: [{ name: { contains: search as string } }, { deletedAt: null }],
      };
    }

    const findAllProduct = await prisma.product.findMany({
      where: whereClause,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    const totalPage = Math.ceil(totalCount / Number(limit));

    res.status(200).json({
      error: false,
      data: { data: findAllProduct, totalPage },
      message: "Berhasil mendapatkan data",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isActive } = req.body;
    const { idProduct } = req.params;

    const findProduct = await prisma.product.findFirst({
      where: { id: Number(idProduct) },
    });

    if (!findProduct || findProduct.deletedAt !== null)
      throw { msg: "Produk sudah tidak tersedia", status: 404 };

    await prisma.product.update({
      where: {
        id: Number(idProduct),
      },
      data: {
        isActive: isActive === "false" ? false : true,
      },
    });

    res.status(200).json({
      error: false,
      data: {},
      message:
        isActive === "true"
          ? "Produkmu sekarang aktif"
          : "Produkmu sudah di non-aktif",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagesUploaded =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  try {
    const { name, description, price, stock, weightGram, isActive } = req.body;

    const { idProduct } = req.params;

    const findProduct = await prisma.product.findFirst({
      where: {
        AND: [{ id: Number(idProduct) }, { deletedAt: null }],
      },
    });

    if (!findProduct || findProduct.deletedAt !== null)
      throw { msg: "Produk sudah tidak tersedia", status: 404 };

    if (!name || !description || !price || !stock || !weightGram)
      throw { msg: "Harap diisi terlebih dahulu", status: 400 };

    if (!imagesUploaded.images || imagesUploaded.images.length === 0) {
      await prisma.product.update({
        where: { id: Number(idProduct) },
        data: {
          name,
          description,
          price: parseFloat(price),
          isActive: isActive === "false" ? false : true,
          stock: Number(stock),
          weightGram: Number(weightGram),
          imageUrl: findProduct.imageUrl,
        },
      });

      res.status(200).json({
        error: false,
        data: {},
        message: "Berhasil mengupdate data",
      });

      return;
    }

    const fileNameOnDb = findProduct.imageUrl
      ?.split("/")
      .pop()
      ?.split("?")?.[0];

    const findFileName = await imageKit.listFiles({
      searchQuery: `name = "${fileNameOnDb}"`,
      limit: 1,
    });

    if (findFileName.length === 0)
      throw { msg: "Nama File tidak tersedia", status: 404 };

    const file = findFileName[0] as FolderObject;
    const fileBuffer = readFileSync(imagesUploaded.images[0].path);
    if (!fileBuffer)
      throw { msg: "Ada kesalahan saat membaca file", status: 404 };

    const fileUploadImageKit = await imageKit.upload({
      file: fileBuffer,
      fileName: imagesUploaded.images[0].filename,
      folder: "/products/body-sparepart",
    });

    if (!fileUploadImageKit) throw { msg: "Gagal upload gambar", status: 400 };

    const uploadedProduct = await prisma.product.update({
      where: { id: Number(idProduct) },
      data: {
        name,
        description,
        price: parseFloat(price),
        isActive: isActive === "false" ? false : true,
        stock: Number(stock),
        weightGram: Number(weightGram),
        imageUrl: fileUploadImageKit.url,
      },
    });

    if (!uploadedProduct)
      throw { msg: "Ada kesalahan saat mengupdate data", status: 400 };

    rmSync(imagesUploaded.images[0].path);
    if ("fileId" in file) await imageKit.deleteFile(file.fileId as string);

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil mengupdate data",
    });
  } catch (error) {
    rmSync(imagesUploaded.images[0].path);
    next(error);
  }
};

export const deleteProductInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idProduct } = req.params;
    const findProduct = await prisma.product.findFirst({
      where: {
        AND: [{ id: Number(idProduct) }, { deletedAt: null }],
      },
    });

    if (!findProduct) throw { msg: "Produk sudah tidak tersedia", status: 404 };

    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(idProduct),
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    if (!updatedProduct) throw { msg: "Gagal menghapus produk", status: 400 };

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil menghapus data",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "5", search = "" } = req.query;
    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    let whereClauses: Prisma.userWhereInput = {};

    if (search) {
      whereClauses = {
        OR: [
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
        ],
      };
    }

    const findAllUser = await prisma.user.findMany({
      where: whereClauses,
      orderBy: { createdAt: "asc" },
      take,
      skip,
    });

    const dataUser = findAllUser?.map((item) => {
      return {
        address: item?.address,
        createdAt: item?.createdAt,
        email: item?.email,
        firstName: item?.firstName,
        id: item?.id,
        lastName: item?.lastName,
        phoneNumber: item?.phoneNumber,
        role: item?.role,
      };
    });

    const totalCount = await prisma.user.count({ where: whereClauses });
    const totalPage = Math.ceil(totalCount / parseInt(limit.toString()));

    res.status(200).json({
      error: false,
      message: "Berhasil mendapatkan data user",
      data: { data: dataUser, totalPage },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params;
    const dataUser = req.user;

    await prisma.$transaction(async (tx) => {
      const findUserById = await tx.user.findFirst({
        where: { id: parseInt(idUser.toString()) },
      });

      if (!findUserById)
        throw { msg: "User sudah terhapus/tidak tersedia", status: 400 };

      if (findUserById?.role === "ADMIN")
        throw {
          msg: "Admin tidak dapat dihapus!",
          status: 400,
        };

      const findUserInTableCart = await tx.cart.findFirst({
        where: { userId: Number(idUser) },
      });

      if (findUserInTableCart) {
        await tx.cart.deleteMany({
          where: { userId: parseInt(idUser.toString()) },
        });
      }

      const findManyChatSession = await tx.chatsession.findMany({
        where: { userId: Number(idUser) },
      });

      if (findManyChatSession.length > 0) {
        await tx.chatsession.deleteMany({
          where: { userId: parseInt(idUser.toString()) },
        });
      }

      const findMessageCust = await tx.messagecustomer.findMany({
        where: { userId: Number(idUser) },
      });

      if (findMessageCust.length > 0) {
        await tx.messagecustomer.deleteMany({
          where: { userId: parseInt(idUser.toString()) },
        });
      }

      const deleted = await tx.user.delete({
        where: { id: parseInt(idUser.toString()) },
      });

      if (!deleted) throw { msg: "Data user gagal dihapus", status: 400 };
    });

    res.status(200).json({
      error: false,
      data: {},
      message: "Data user berhasil di hapus",
    });
  } catch (error) {
    next(error);
  }
};

export const addNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, role, phoneNumber } = req.body;

    const findUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (findUserByEmail)
      throw {
        msg: "Pengguna sudah tersedia, gunakan email lain.",
        status: 400,
      };

    const hash = await hashPassword("12312312");
    const created = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hash,
        phoneNumber,
        role,
      },
    });

    if (!created)
      throw { msg: "Ada kesalahan saat membuat user.", status: 500 };

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil membuat user baru",
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryMotorCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllCategory = await prisma.categorymotorcyle.findMany();
    if (findAllCategory.length === 0)
      throw { msg: "Data tidak tersedia", status: 404 };

    res.status(200).json({
      error: false,
      data: findAllCategory,
      message: "Berhasil menampilkan data kategori motor",
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryMotorId } = req.params;

    const findAllCategoryByCategoryMotor = await prisma.category.findMany({
      where: {
        categoryMotorcycleId: Number(categoryMotorId),
      },
    });

    if (findAllCategoryByCategoryMotor.length === 0)
      throw { msg: "Gagal mendapatkan data kategori", status: 404 };

    res.status(200).json({
      error: false,
      data: findAllCategoryByCategoryMotor,
      message: "Berhasil mendapatkan data kategori",
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "5", search = "" } = req.query;
    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    let whereClause: Prisma.categoryWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { categoryName: { contains: search as string } },
          {
            categorymotorcyle: {
              motorCycleName: { contains: search as string },
            },
          },
        ],
      };
    }

    const findAllCategory = await prisma.category.findMany({
      include: { categorymotorcyle: true },
      where: whereClause,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

    if (findAllCategory.length === 0)
      throw { msg: "Data kategori kosong", status: 404 };
    const totalCount = await prisma.category.count({ where: whereClause });
    const totalPage = Math.ceil(totalCount / Number(limit));

    res.status(200).json({
      error: false,
      data: { data: findAllCategory, totalPage },
      message: "Berhasil mendapatkan data kategori",
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      idCategoryMotor,
      dataMotorOptional,
      releaseYearOptional,
      categoryName,
    } = req.body;

    if (!categoryName)
      throw { msg: "Harap diisi terlebih dahulu", status: 400 };
    if (!!dataMotorOptional && !!releaseYearOptional) {
      await prisma.$transaction(async (tx) => {
        const dataCategoryMotor = await tx.categorymotorcyle.create({
          data: {
            motorCycleName: dataMotorOptional,
            releaseYear: Number(releaseYearOptional),
          },
        });

        if (!dataCategoryMotor)
          throw {
            msg: "Gagal melakukan proses pembuatan nama kategori motor",
            status: 400,
          };

        await tx.category.create({
          data: {
            categoryName,
            categoryMotorcycleId: dataCategoryMotor.id,
          },
        });
      });

      res.status(201).json({
        error: false,
        data: {},
        message: "Berhasil membuat data kategori baru",
      });

      return;
    }

    const createDataCategory = await prisma.category.create({
      data: {
        categoryName,
        categoryMotorcycleId: Number(idCategoryMotor),
      },
    });

    if (!createDataCategory)
      throw { msg: "Gagal membuat data kategori", status: 400 };

    res.status(201).json({
      error: false,
      data: {},
      message: "Berhasil membuat data kategori baru",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, categoryName, categoryMotorcycleId } = req.body;

    const catId = Number(categoryId);
    const catMotorId = Number(categoryMotorcycleId);

    const findCategory = await prisma.category.findFirst({
      where: { id: catId },
    });

    if (!findCategory)
      throw { msg: "Data kategori sudah tidak tersedia", status: 400 };

    if (
      categoryName === findCategory?.categoryName &&
      catMotorId === findCategory?.categoryMotorcycleId
    )
      throw { msg: "Data tidak ada yang diubah", status: 400 };

    const updated = await prisma.category.update({
      where: { id: catId },
      data: {
        categoryName,
        categoryMotorcycleId: catMotorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!updated)
      throw { msg: "Ada kesalahan saat mengupdate kategori", status: 400 };

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil merubah data kategori",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCategory } = req.params;
    const found = await prisma.category.findFirst({
      where: { id: Number(idCategory) },
    });

    if (!found) throw { msg: "Kategori tidak ditemukan", status: 400 };

    const foundInProduct = await prisma.product.findFirst({
      where: { categoryId: Number(idCategory) },
    });

    if (foundInProduct)
      throw {
        msg: "Gagal menghapus! Ada beberapa produk yang digunakan menggunakan kategori ini.",
        status: 400,
      };

    const processed = await prisma.category.delete({
      where: { id: Number(idCategory) },
    });

    if (!processed) throw { msg: "Gagal saat menghapus kategori", status: 400 };

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil menghapus kategori",
    });
  } catch (error) {
    next(error);
  }
};

export const createReportSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resi, product } = req.body as {
      resi: string;
      product: Array<{
        productId: number;
        quantity: 2;
        tax: number;
      }>;
    };

    if (!resi || !product?.length)
      throw { msg: "Data tidak lengkap", status: 400 };

    const grouped = product.reduce((acc, p) => {
      const exist = acc.find((x) => x.productId === p.productId);
      if (exist) {
        exist.quantity += p.quantity;
        exist.tax += p.tax;
      } else {
        acc.push({ ...p });
      }
      return acc;
    }, [] as typeof product);

    const productIdArray = grouped.map((v) => v.productId);
    const findProduct = await prisma.product.findMany({
      where: { id: { in: productIdArray } },
      select: { id: true, price: true, stock: true },
    });

    const checkedStock = findProduct?.filter((v) => v?.stock <= 0);
    if (checkedStock?.length > 0)
      throw {
        msg: "Stock tidak boleh kurang dari 0, harap mengubah stock sebelum melanjutkan.",
        status: 400,
      };

    if (findProduct?.length === 0)
      throw { msg: "Produk tidak tersedia", status: 400 };

    const isValidArray = productIdArray?.every((prod) =>
      findProduct?.map((p) => p?.id)?.includes(prod)
    );

    if (!isValidArray)
      throw { msg: "Ada Produk yang tidak tersedia", status: 400 };

    await prisma.$transaction(async (tx) => {
      const foundResiExist = await tx.report.findFirst({
        where: { resiNumber: resi },
      });

      if (!foundResiExist) {
        const createdReport = await tx.report.create({
          data: { resiNumber: resi },
        });

        if (!createdReport)
          throw { msg: "Gagal saat menyimpan laporan", status: 400 };

        for (const item of grouped) {
          const createdItems = await tx.reportitems.create({
            data: {
              adminFee: item?.tax,
              qty: item?.quantity,
              reportId: createdReport?.id,
              productId: item?.productId,
            },
          });

          if (!createdItems)
            throw { msg: "Gagal saat menyimpan kedalam database", status: 400 };

          const foundProductExist = await tx.product.findFirst({
            where: { id: item?.productId },
          });

          if (!foundProductExist)
            throw { msg: "Gagal saat menemukan produk", status: 400 };

          const accumulate = foundProductExist?.stock - item?.quantity;
          const isDeadStock = accumulate < 0;

          if (isDeadStock)
            throw {
              msg: `Gagal karna stock saat ini tersisa ${foundProductExist?.stock}, ada kesalahan dalam membuat laporan.`,
              status: 400,
            };

          await tx.product.update({
            where: { id: item?.productId },
            data: {
              stock: { decrement: item?.quantity },
            },
          });
        }
      } else {
        for (const item of grouped) {
          const existingItem = await tx.reportitems.findUnique({
            where: {
              reportId_productId: {
                reportId: foundResiExist.id,
                productId: item.productId,
              },
            },
          });

          const foundProductExist = await tx.product.findFirst({
            where: { id: item?.productId },
          });

          if (!foundProductExist)
            throw { msg: "Gagal saat menemukan produk", status: 400 };

          if (existingItem) {
            const updated = await tx.reportitems.update({
              where: {
                reportId_productId: {
                  reportId: foundResiExist.id,
                  productId: item.productId,
                },
              },
              data: {
                qty: { increment: item.quantity },
                adminFee: { increment: item.tax },
              },
            });

            if (!updated)
              throw { msg: "Gagal saat menyimpan laporan", status: 400 };
          } else {
            await tx.reportitems.create({
              data: {
                reportId: foundResiExist.id,
                productId: item.productId,
                qty: item.quantity,
                adminFee: item.tax,
              },
            });
          }

          const accumulate = foundProductExist?.stock - item?.quantity;
          const isDeadStock = accumulate < 0;

          if (isDeadStock)
            throw {
              msg: `Gagal karna stock saat ini tersisa ${foundProductExist?.stock}, ada kesalahan dalam membuat laporan.`,
              status: 400,
            };

          await tx.product.update({
            where: { id: item?.productId },
            data: {
              stock: { decrement: item?.quantity },
            },
          });
        }
      }
    });

    res.status(201).json({
      error: false,
      message: "Berhasil membuat data laporan.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getReportSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tz = "Asia/Jakarta";

  try {
    const { search = "", date } = req.query as { search: string; date: string };
    const parseDate = dayjs.tz(date, tz);

    let whereClause: Prisma.reportWhereInput = {};

    if (search) {
      whereClause = {
        resiNumber: { contains: search as string },
      };
    }

    const startOfDay = parseDate.startOf("day").toDate();
    const endOfDay = parseDate.endOf("day").toDate();

    const dataReport = await prisma.report.findMany({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        reportitems: { include: { product: true } },
      },
    });

    const data = dataReport
      ?.map((item) => {
        console.log(item?.createdAt);
        return {
          id: item?.id,
          resi: item?.resiNumber,
          report: item?.reportitems?.map((v) => {
            const { name, description, price, imageUrl, isActive } =
              v?.product || {};

            const subtotal = v?.qty * price;
            const net = subtotal - v?.adminFee;

            return {
              id: v?.id,
              quantity: v?.qty,
              fee: v?.adminFee,
              productName: name,
              description,
              price,
              subtotal,
              net,
              imageUrl,
              isActive,
            };
          }),
        };
      })
      .filter((c) => !!c);

    const dataSummary = {
      subtotal: data
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.price * curr?.quantity, 0),
      tax: data
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.fee, 0),
      net: data
        ?.flatMap((v) => v?.report)
        ?.reduce(
          (acc, curr) => acc + (curr?.price * curr?.quantity - curr?.fee),
          0
        ),
      transaction: (data || [])?.flatMap((v) => v?.report)?.length,
      qty: (data || [])
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.quantity, 0),
    };

    const { net, tax, qty, transaction } = dataSummary || {};
    const start = dayjs().tz(tz).subtract(1, "day").startOf("day").toDate();
    const end = dayjs().tz(tz).startOf("day").toDate();

    const dataReportYesterday = await prisma.report.findMany({
      where: { createdAt: { gte: start, lt: end } },
      include: {
        reportitems: {
          include: { product: true },
        },
      },
    });

    const yesterday = dataReportYesterday?.map((item) => ({
      ...item,
      report: item?.reportitems?.map((v) => ({
        qty: v?.qty,
        fee: v?.adminFee,
        price: v?.product?.price,
      })),
    }));

    const yesterdaySummary = {
      subtotal: yesterday
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.price * curr?.qty, 0),

      tax: yesterday
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.fee, 0),

      net: yesterday
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + (curr?.price * curr?.qty - curr?.fee), 0),

      transaction: (yesterday || [])?.flatMap((v) => v?.report)?.length,

      qty: (yesterday || [])
        ?.flatMap((v) => v?.report)
        ?.reduce((acc, curr) => acc + curr?.qty, 0),
    };

    const percent = (today: number, yesterday: number) => {
      if (!yesterday || yesterday === 0) {
        const hasGrowth = today > 0;

        return {
          value: hasGrowth ? 100 : 0,
          trend: hasGrowth ? "up" : "equal",
          isPositive: hasGrowth,
        };
      }

      const value = (today / yesterday - 1) * 100;

      return {
        value: Number(value.toFixed(2)),
        trend: value > 0 ? "up" : value < 0 ? "down" : "equal",
        isPositive: value >= 0,
      };
    };

    const percentage = {
      revenue: percent(dataSummary.net, yesterdaySummary.net),
      transaction: percent(
        dataSummary.transaction,
        yesterdaySummary.transaction
      ),
      qty: percent(dataSummary.qty, yesterdaySummary.qty),
      tax: percent(dataSummary.tax, yesterdaySummary.tax),
    };

    const dataResponse = {
      date: parseDate.format("DD MMMM YYYY"),
      total: [
        {
          name: "Total Pemasukan",
          value: net,
          yesterday: yesterdaySummary.net,
          isFormatRupiah: true,
          percentage: percentage.revenue.value,
          trend: percentage.revenue.trend,
          isPositive: percentage.revenue.isPositive,
        },
        {
          name: "Total Transaksi",
          value: transaction,
          yesterday: yesterdaySummary.transaction,
          isFormatRupiah: false,
          percentage: percentage.transaction.value,
          trend: percentage.transaction.trend,
          isPositive: percentage.transaction.isPositive,
        },
        {
          name: "Total Item",
          value: qty,
          yesterday: yesterdaySummary.qty,
          isFormatRupiah: false,
          percentage: percentage.qty.value,
          trend: percentage.qty.trend,
          isPositive: percentage.qty.isPositive,
        },
        {
          name: "Total Potongan",
          value: tax,
          yesterday: yesterdaySummary.tax,
          isFormatRupiah: true,
          percentage: percentage.tax.value,
          trend: percentage.tax.trend,
          isPositive: percentage.tax.isPositive,
        },
      ],
      data,
      summary: dataSummary,
    };

    res.status(200).json({
      error: false,
      message: "Berhasil mendapat data report",
      data: dataResponse,
    });
  } catch (error) {
    next(error);
  }
};
