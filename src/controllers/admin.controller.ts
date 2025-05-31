import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { imageKit } from "../utils/imageKit";
import { readFileSync, rmSync } from "fs";
import { Prisma } from "@prisma/client";
import type { FolderObject } from "imagekit/dist/libs/interfaces";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const imagesUploaded = (req.files as { [fieldname: string]: Express.Multer.File[] } || {})

    try {
        const userId = req.user?.id
        const { name,
            description,
            price,
            isActive,
            stock,
            weightGram, } = req.body

        if (!name || !description || !price || !stock || !weightGram) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
        if (!imagesUploaded.images || imagesUploaded.images.length === 0) throw { msg: 'Tidak ada data yang di upload', status: 404 }

        const fileBuffer = readFileSync(imagesUploaded.images[0].path)
        if (!!fileBuffer) {
            const fileUploadImageKit = await imageKit.upload({
                file: fileBuffer,
                fileName: imagesUploaded.images[0].filename,
                folder: "/products/body-sparepart"
            })

            if (!fileUploadImageKit) throw { msg: 'Gagal upload data', status: 400 }
            const uploadedProduct = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    imageUrl: fileUploadImageKit.url,
                    isActive: isActive === 'false' ? false : true,
                    stock: Number(stock),
                    weightGram: Number(weightGram),
                    ownerId: Number(userId)
                }
            })

            if (!uploadedProduct) throw { msg: 'Gagal membuat produk', status: 400 }
            rmSync(imagesUploaded.images[0].path)
        }

        res.status(200).json({
            data: {},
            error: false,
            message: 'Berhasil mengupload produk!'
        })

    } catch (error) {
        rmSync(imagesUploaded.images[0].path)
        next(error)
    }
}

export const getAllDataProductAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search = '', limit = '5', page = '1' } = req.query

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take

        let whereClause: Prisma.ProductWhereInput = {
            deletedAt: null
        }

        if (search) {
            whereClause = {
                OR: [
                    { name: { contains: search as string } },
                ]
            }
        }

        const findAllProduct = await prisma.product.findMany({
            where: whereClause, take, skip,
            orderBy: { name: 'asc' }
        })

        const totalCount = await prisma.product.count({
            where: whereClause
        })

        const totalPage = Math.ceil(totalCount / Number(limit))

        res.status(200).json({
            error: false,
            data: { data: findAllProduct, totalPage },
            message: 'Berhasil mendapatkan data'
        })
    } catch (error) {
        next(error)
    }
}

export const updateProductActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isActive } = req.body
        const { idProduct } = req.params

        const findProduct = await prisma.product.findFirst({
            where: { id: Number(idProduct) }
        })

        if (!findProduct || findProduct.deletedAt !== null) throw { msg: 'Produk sudah tidak tersedia', status: 404 }

        await prisma.product.update({
            where: {
                id: Number(idProduct)
            }, data: {
                isActive: isActive === 'false' ? false : true
            }
        })

        res.status(200).json({
            error: false,
            data: {},
            message: isActive === 'true' ?
                'Produkmu sekarang aktif'
                : 'Produkmu sudah di non-aktif'
        })

    } catch (error) {
        next(error)
    }
}

export const updateProductInformation = async (req: Request, res: Response, next: NextFunction) => {
    const imagesUploaded = (req.files as { [fieldname: string]: Express.Multer.File[] } || {})

    try {
        const { name,
            description,
            price,
            stock,
            weightGram,
            isActive } = req.body

        const { idProduct } = req.params

        const findProduct = await prisma.product.findFirst({
            where: {
                AND: [
                    { id: Number(idProduct) },
                    { deletedAt: null }
                ]
            }
        })

        if (!findProduct || findProduct.deletedAt !== null) throw { msg: 'Produk sudah tidak tersedia', status: 404 }
        if (!name || !description || !price || !stock || !weightGram) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
        if (!imagesUploaded.images || imagesUploaded.images.length === 0) throw { msg: 'Tidak ada data yang di upload', status: 404 }

        const fileNameOnDb = findProduct.imageUrl?.split('/').pop()
        const findFileName = await imageKit.listFiles({
            searchQuery: `name = "${fileNameOnDb}"`,
            limit: 1
        })

        if (findFileName.length === 0) throw { msg: 'Nama File tidak tersedia', status: 404 }

        const file = findFileName[0] as FolderObject
        const fileBuffer = readFileSync(imagesUploaded.images[0].path)
        if (!fileBuffer) throw { msg: 'Ada kesalahan saat membaca file', status: 404 }

        const fileUploadImageKit = await imageKit.upload({
            file: fileBuffer,
            fileName: imagesUploaded.images[0].filename,
            folder: "/products/body-sparepart"
        })

        if (!fileUploadImageKit) throw { msg: 'Gagal upload gambar', status: 400 }

        const uploadedProduct = await prisma.product.update({
            where: { id: Number(idProduct) },
            data: {
                name,
                description,
                price: parseFloat(price),
                isActive: isActive === 'false' ? false : true,
                stock: Number(stock),
                weightGram: Number(weightGram),
                imageUrl: fileUploadImageKit.url
            }
        })

        if (!uploadedProduct) throw { msg: 'Ada kesalahan saat mengupdate data', status: 400 }
        rmSync(imagesUploaded.images[0].path)
        if ("fileId" in file) await imageKit.deleteFile(file.fileId as string)

        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil mengupdate data'
        })

    } catch (error) {
        rmSync(imagesUploaded.images[0].path)
        next(error)
    }
}