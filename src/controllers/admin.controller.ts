import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";
import { imageKit } from "../utils/imageKit";
import { readFileSync } from "fs";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imagesUploaded = (req.files as { [fieldname: string]: Express.Multer.File[] } || {})
        const userId = req.user?.id
        const { name,
            description,
            price,
            isActive,
            stock,
            weightGram, } = req.body

        if (!name || !description || !price || !isActive || !stock || !weightGram) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
        if (!imagesUploaded.images || imagesUploaded.images.length === 0) throw { msg: 'Tidak ada data yang di upload', status: 404 }

        const fileBuffer = readFileSync(imagesUploaded.images[0].path)
        if (!!fileBuffer) {
            var fileUploadImageKit = await imageKit.upload({
                file: fileBuffer,
                fileName: imagesUploaded.images[0].filename,
                folder: "/products/body-sparepart"
            }).catch((err) => {
                throw { msg: 'Gagal upload ke ImageKit', status: 500 }
            })

            if (!fileUploadImageKit) throw { msg: 'Gagal upload data', status: 400 }
            await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    imageUrl: fileUploadImageKit.url,
                    isActive: Boolean(isActive),
                    stock: Number(stock),
                    weightGram: Number(weightGram),
                    ownerId: Number(userId)
                }
            })
        }

        res.status(200).json({
            data: {},
            error: false,
            message: 'Berhasil mengupload produk!'
        })

    } catch (error) {
        const costumError = error as any
        if (costumError.msg === 'Gagal upload ke ImageKit') {
            try {
                await imageKit.deleteFile(fileUploadImageKit!.fileId)
            } catch (error) {
                console.log(error, '<<')
                next(error)
            }
        }

        next(error)
    }
}