import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataUser = req.user;
    const { productId, quantity, price } = req.body;

    const findProduct = await prisma.product.findFirst({
      where: { id: Number(productId) },
    });

    if (!findProduct) throw { msg: "Produk tidak ada", status: 400 };

    const findUser = await prisma.user.findFirst({
      where: { id: Number(dataUser?.id) },
    });

    if (!findUser) throw { msg: "User tidak tersedia", status: 400 };

    const findProductSame = await prisma.cart.findFirst({
      where: {
        AND: [
          { userId: Number(dataUser?.id) },
          { productId: Number(productId) },
        ],
      },
    });

    if (findProductSame) {
      const currentQuantity = findProductSame?.quantity + Number(quantity);
      if (currentQuantity > findProduct?.stock)
        throw {
          msg: "Anda sudah mencapai batas stock",
          status: 400,
        };

      const updated = await prisma.cart.update({
        where: { id: findProductSame?.id },
        data: {
          price: Number(price),
          totalPrice: Number(price) * currentQuantity,
          quantity: currentQuantity,
          updatedAt: new Date(),
        },
      });

      if (!updated)
        throw { msg: "Gagal memperbaharui keranjang anda", status: 400 };

      res.status(200).json({
        error: false,
        data: {},
        message: "Berhasil menambahkan ke keranjang anda",
      });

      return;
    }

    const createdCart = await prisma.cart.create({
      data: {
        price: Number(price),
        quantity: Number(quantity),
        productId: Number(productId),
        userId: Number(dataUser?.id),
        totalPrice: Number(price) * Number(quantity),
      },
    });

    if (!createdCart)
      throw { msg: "Gagal saat menambahkan produk ke keranjang", status: 400 };

    res.status(200).json({
      error: false,
      data: {},
      message: "Berhasil menambahkan ke keranjang anda",
    });
  } catch (error) {
    next(error);
  }
};

export const getShoppingCartUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataUser = req.user;
    const findDataCart = await prisma.cart.findMany({
      where: { userId: Number(dataUser?.id) },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    if (findDataCart?.length === 0) {
      res.status(200).json({
        error: false,
        message: "Berhasil mendapatkan data",
        data: [],
      });

      return;
    }

    res.status(200).json({
      error: false,
      message: "Berhasil mendapatkan data",
      data: findDataCart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartId } = req.params;
    const findDataCart = await prisma.cart.findFirst({
      where: { id: Number(cartId) },
    });

    if (!findDataCart)
      throw { msg: "Data sudah terhapus/data tidak tersedia", status: 400 };

    const deleted = await prisma.cart.delete({ where: { id: Number(cartId) } });
    if (!deleted) throw { msg: "Gagal saat menghapus cart", status: 400 };

    res
      .status(200)
      .json({ error: false, message: "Data berhasil dihapus", data: {} });
  } catch (error) {
    next(error);
  }
};

export const summarizeQuantityCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { summarize, cartId } = req.body;

    const findCart = await prisma.cart.findFirst({
      where: { id: Number(cartId) },
    });

    if (!findCart) throw { msg: "Data cart sudah tidak tersedia", status: 400 };
    const findProduct = await prisma.product.findFirst({
      where: { id: Number(findCart?.productId) },
    });

    if (!findProduct)
      throw { msg: "Tidak ditemukan product pada cart ini", status: 400 };

    const stockProduct = findProduct?.stock;
    if (summarize === "plus") {
      const currentQuantity = findCart?.quantity + 1;
      const currentTotalPrice = findCart?.price * currentQuantity;

      if (currentQuantity > stockProduct)
        throw { msg: "Stock produk sudah mencapai batas", status: 400 };

      const updated = await prisma.cart.update({
        where: { id: Number(cartId) },
        data: { quantity: currentQuantity, totalPrice: currentTotalPrice },
      });

      if (!updated)
        throw { msg: "Gagal saat menambahkan data quantity", status: 400 };

      res.status(200).json({
        error: false,
        data: {},
        message: "Berhasil menambahkan data quantity",
      });

      return;
    } else if (summarize === "minus") {
      const currentQuantity = findCart?.quantity - 1;
      const currentTotalPrice = findCart?.price * currentQuantity;

      if (currentQuantity < 1)
        throw { msg: "Stock produk tidak boleh kurang dari 0", status: 400 };

      const updated = await prisma.cart.update({
        where: { id: Number(cartId) },
        data: { quantity: currentQuantity, totalPrice: currentTotalPrice },
      });

      if (!updated)
        throw { msg: "Gagal saat mengurangi data quantity", status: 400 };

      res.status(200).json({
        error: false,
        data: {},
        message: "Berhasil mengurangi data quantity",
      });

      return;
    }
  } catch (error) {
    next(error);
  }
};
