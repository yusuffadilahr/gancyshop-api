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
