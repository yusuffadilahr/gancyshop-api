import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns";

export const getAllProductPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            limit = '5', page = '1', search,
            category, minPrice, maxPrice,
            minWeight, maxWeight, statusProduct,
            stock, tanggalDibuat
        } = req.query

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take

        let whereClause: Prisma.ProductWhereInput = {
            AND: [
                { deletedAt: null },
                { isActive: true },
            ]
        }

        const stockValidation =
            stock === 'stok-habis' ? { equals: 0 } :
                stock === 'hampir-habis' ? { gte: 1, lte: 9 } :
                    stock === 'tersedia' ? { gte: 10 } :
                        undefined;

        if (search || category || tanggalDibuat || minPrice || maxPrice ||
            minWeight || maxWeight || stock) {
            whereClause = {
                ...whereClause,
                AND: [
                    ...(search ? [{ name: { contains: search as string } }] : []),
                    ...(category ? [{ categoryId: Number(category) }] : []),
                    
                    ...(tanggalDibuat ? [{
                        createdAt: {
                            gte: new Date(tanggalDibuat as string),
                            lte: addDays(new Date(tanggalDibuat as string), 1)
                        }
                    }] : []),

                    ...(minPrice && maxPrice ? [{
                        price: {
                            gte: Number(minPrice),
                            lte: Number(maxPrice)
                        }
                    }] : []),

                    ...(minWeight && maxWeight ? [{
                        weightGram: {
                            gte: Number(minWeight),
                            lte: Number(maxWeight)
                        }
                    }] : []),
                    
                    ...(stock ? [{ stock: stockValidation }] : [])
                ]
            }
        }

        const findAllProduct = await prisma.product.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        })

        const totalCount = await prisma.product.count({ where: whereClause })

        const totalPage = Math.ceil(totalCount / Number(limit))

        if (findAllProduct.length === 0) throw { msg: 'Data tidak tersedia/kosong', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: {
                totalPage,
                data: findAllProduct
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getCategoryForFilterProductPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findAllCategory = await prisma.category.findMany()
        if (findAllCategory.length === 0) throw { msg: 'Data kategori tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan kategori',
            data: findAllCategory
        })
    } catch (error) {
        next(error)
    }
}