import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { Prisma } from "@prisma/client";

export const getAllProductPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = '6', page = '1', search } = req.query

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take

        let whereClause: Prisma.ProductWhereInput = {
            AND: [
                { deletedAt: null },
                { isActive: true }
            ]
        }

        if (!!search) {
            whereClause = {
                ...whereClause,
                OR: [
                    { name: { contains: search as string } }
                ]
            }
        }

        const findAllProduct = await prisma.product.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'desc' }
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