import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";

export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findAllProduct = await prisma.product.findMany({
            where: {
                AND: [
                    { deletedAt: null },
                    { isActive: true }
                ]
            }
        })

        if (findAllProduct.length === 0) throw { msg: 'Data tidak tersedia/kosong', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: findAllProduct
        })
    } catch (error) {
        next(error)
    }
}