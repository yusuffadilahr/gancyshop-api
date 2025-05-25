import { NextFunction, Request, Response } from "express";
import prisma from "../connection/db";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imagesUploaded = req.files
        const { name,
            price,
            isActive,
            stock,
            weightGram, } = req.body

        // await prisma.product.create({
        //     data: {
        //         name,
        //         price,
        //         imageUrl,
        //         isActive,
        //         stock,
        //         weightGram,
        //     }
        // })

        res.status(200).json({
            data: {},
            error: false,
            message: 'Berhasil mengupload produk!'
        })
        
    } catch (error) {
        next()
    }
}