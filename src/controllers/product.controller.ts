import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { Prisma } from "@prisma/client";
import { addDays, addHours, endOfDay, format, startOfDay } from "date-fns";

export const getAllProductPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit = "5",
      page = "1",
      search = "",
      category = "",
      minPrice = "",
      maxPrice = "",
      minWeight = "",
      maxWeight = "",
      stock = "",
      tanggalDibuat = "",
    } = req.query;

    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    let whereClause: Prisma.productWhereInput = {
      AND: [{ deletedAt: null }, { isActive: true }],
    };

    const stockValidation =
      stock === "stok-habis"
        ? { equals: 0 }
        : stock === "hampir-habis"
        ? { gte: 1, lte: 9 }
        : stock === "tersedia"
        ? { gte: 10 }
        : undefined;

    if (
      search ||
      category ||
      tanggalDibuat ||
      minPrice ||
      maxPrice ||
      minWeight ||
      maxWeight ||
      stock
    ) {
      const [day, month, year] = (tanggalDibuat as string)
        .split("/")
        .map(Number);
      const formatDateConvert = new Date(year, month - 1, day);

      whereClause = {
        ...whereClause,
        AND: [
          ...(search
            ? [
                {
                  name: { contains: search as string },
                },
              ]
            : []),

          ...(category
            ? [
                {
                  categoryId: Number(category),
                },
              ]
            : []),

          ...(tanggalDibuat
            ? [
                {
                  createdAt: {
                    gte: new Date(formatDateConvert),
                    lte: addDays(endOfDay(formatDateConvert), 1),
                  },
                },
              ]
            : []),

          ...(minPrice && maxPrice
            ? [
                {
                  price: {
                    gte: Number(minPrice),
                    lte: Number(maxPrice),
                  },
                },
              ]
            : []),

          ...(minWeight && maxWeight
            ? [
                {
                  weightGram: {
                    gte: Number(minWeight),
                    lte: Number(maxWeight),
                  },
                },
              ]
            : []),

          ...(stock
            ? [
                {
                  stock: stockValidation,
                },
              ]
            : []),
        ],
      };
    }

    const findAllProduct = await prisma.product.findMany({
      where: whereClause,
      take,
      skip,
      orderBy: { createdAt: tanggalDibuat ? "asc" : "desc" },
      include: {
        category: true,
      },
    });

    const totalCount = await prisma.product.count({ where: whereClause });
    const totalPage = Math.ceil(totalCount / Number(limit));

    if (findAllProduct.length === 0)
      throw { msg: "Data tidak tersedia/kosong", status: 404 };

    res.status(200).json({
      error: false,
      message: "Berhasil menampilkan data",
      data: {
        totalPage,
        data: findAllProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idProduct } = req.params;
    const dataUser = req.user;
    
    if (!idProduct) throw { msg: "ID tidak ditemukan", status: 404 };
    const findProductById = await prisma.product.findFirst({
      where: { id: Number(idProduct) },
      include: {
        category: true,
        cart: {
          where: { userId: Number(dataUser?.id) },
        },
      },
    });

    if (!findProductById)
      throw { msg: "Data produk tidak tersedia", status: 404 };

    res.status(200).json({
      error: false,
      data: findProductById,
      message: "Berhasil mendapatkan data produk",
    });
  } catch (error) {
    next(error);
  }
};
