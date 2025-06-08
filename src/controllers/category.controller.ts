import { NextFunction, Request, Response } from "express"
import prisma from "../connection/db"

export const getCategoryMotorCycle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findAllCategory = await prisma.categoryMotorcyle.findMany()
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

export const getCategoryProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryMotorId } = req.params

        const findAllCategoryByCategoryMotor = await prisma.category.findMany({
            where: {
                categoryMotorcyleId: Number(categoryMotorId)
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

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idCategoryMotor, dataMotorOptional, releaseYearOptional, categoryName } = req.body

        if (!categoryName) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }

        if (!!dataMotorOptional && !!releaseYearOptional) {
            await prisma.$transaction(async (tx) => {
                const dataCategoryMotor = await tx.categoryMotorcyle.create({
                    data: {
                        motorCycleName: dataMotorOptional,
                        releaseYear: releaseYearOptional,
                    }
                })

                if (!dataCategoryMotor) throw { msg: 'Gagal melakukan proses pembuatan nama kategori motor', status: 400 }

                await tx.category.create({
                    data: {
                        categoryName,
                        categoryMotorcyleId: dataCategoryMotor.id
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
                categoryMotorcyleId: idCategoryMotor,
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