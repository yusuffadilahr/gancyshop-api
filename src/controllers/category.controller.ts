import { NextFunction, Request, Response } from "express"
import prisma from "../connection/db"
import { Prisma } from "@prisma/client"

export const getCategoryMotorCycle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findAllCategory = await prisma.categorymotorcyle.findMany()
        if (findAllCategory.length === 0) throw { msg: 'Data tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            data: findAllCategory,
            message: 'Berhasil menampilkan data kategori motor'
        })
    } catch (error) {
        next(error)
    }
}

export const getCategoryProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryMotorId } = req.params

        const findAllCategoryByCategoryMotor = await prisma.category.findMany({
            where: {
                categoryMotorcycleId: Number(categoryMotorId)
            }
        })

        if (findAllCategoryByCategoryMotor.length === 0) throw { msg: 'Gagal mendapatkan data kategori', status: 404 }

        res.status(200).json({
            error: false,
            data: findAllCategoryByCategoryMotor,
            message: 'Berhasil mendapatkan data kategori'
        })

    } catch (error) {
        next(error)
    }
}

export const getCategoryProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = '1', limit = '5', search = '' } = req.query
        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take

        let whereClause: Prisma.categoryWhereInput = {
            deletedAt: null
        }

        if (!!search) {
            whereClause = {
                ...whereClause,
                categoryName: { contains: search as string },
                categorymotorcyle: {
                    motorCycleName: { contains: search as string }
                }
            }
        }

        const findAllCategory = await prisma.category.findMany({
            include: {
                categorymotorcyle: true
            },
            where: whereClause, take, skip,
            orderBy: { createdAt: 'desc' }
        })

        if (findAllCategory.length === 0) throw { msg: 'Data kategori kosong', status: 404 }
        res.status(200).json({
            error: false,
            data: findAllCategory,
            message: 'Berhasil mendapatkan data kategori'
        })
    } catch (error) {
        next(error)
    }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idCategoryMotor, dataMotorOptional, releaseYearOptional, categoryName } = req.body

        if (!categoryName) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
        if (!!dataMotorOptional && !!releaseYearOptional) {
            await prisma.$transaction(async (tx) => {
                const dataCategoryMotor = await tx.categorymotorcyle.create({
                    data: {
                        motorCycleName: dataMotorOptional,
                        releaseYear: Number(releaseYearOptional),
                    }
                })

                if (!dataCategoryMotor) throw { msg: 'Gagal melakukan proses pembuatan nama kategori motor', status: 400 }

                await tx.category.create({
                    data: {
                        categoryName,
                        categoryMotorcycleId: dataCategoryMotor.id
                    }
                })
            })

            res.status(201).json({
                error: false,
                data: {},
                message: 'Berhasil membuat data kategori baru'
            })

            return
        }

        const createDataCategory = await prisma.category.create({
            data: {
                categoryName,
                categoryMotorcycleId: Number(idCategoryMotor),
            }
        })

        if (!createDataCategory) throw { msg: 'Gagal membuat data kategori', status: 400 }

        res.status(201).json({
            error: false,
            data: {},
            message: 'Berhasil membuat data kategori baru'
        })

    } catch (error) {
        next(error)
    }
}