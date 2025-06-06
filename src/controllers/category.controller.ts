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