import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";

export const getCategoryForFilterProductPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllCategory = await prisma.category.findMany();
    if (findAllCategory.length === 0)
      throw { msg: "Data kategori tidak tersedia", status: 404 };

    res.status(200).json({
      error: false,
      message: "Berhasil mendapatkan kategori",
      data: findAllCategory,
    });
  } catch (error) {
    next(error);
  }
};
