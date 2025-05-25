import multer from "multer";

export const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/images')
    },
    filename: (req, file, cb) => {
        const splitOriginalName = file.originalname.split('.')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + splitOriginalName[splitOriginalName.length - 1])
    }
})

const fileFilter = (req: any, file: any, cb: any) => {
    const extensionAccepted = ['png', 'jpg', 'jpeg', 'webp', 'svg']

    const splitOriginalName = file.originalname.split('.')
    if (!extensionAccepted.includes(splitOriginalName[splitOriginalName.length - 1])) {
        return cb(new Error('Format File Tidak Diizinkan'))
    }

    return cb(null, true)
}

export const uploadMulter = multer({
    storage: multerStorage,
    fileFilter: fileFilter, limits: { fileSize: 2000000 }
})