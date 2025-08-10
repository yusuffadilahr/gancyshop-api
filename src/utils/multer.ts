import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

export const multerStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const uploadPath = path.join(__dirname, '../../public/images')
        cb(null, uploadPath)
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const splitOriginalName = file.originalname.split('.')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + splitOriginalName[splitOriginalName.length - 1])
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const extensionAccepted = ['png', 'jpg', 'jpeg', 'webp', 'svg']

    const splitOriginalName = file.originalname.split('.')
    if (!extensionAccepted.includes(splitOriginalName[splitOriginalName.length - 1])) {
        return cb(new Error('Format File Tidak Diizinkan'))
    }

    return cb(null, true)
}

export const uploadMulter = multer({
    storage: multerStorage,
    fileFilter: fileFilter, limits: { fileSize: 2 * 1024 * 1024 }
})