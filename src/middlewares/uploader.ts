
import { NextFunction, Request, Response } from 'express';
import { uploadMulter } from '../utils/multer';

export const uploader = (req: Request, res: Response, next: NextFunction) => {
    const uploaded = uploadMulter.fields([{ name: 'images', maxCount: 1 }])
    const userId = req.user?.id
    const userRole = req.user?.role

    uploaded(req, res, function (err) {
        try {
            if (err) throw { msg: err.message, status: err.status }

            const files = (req.files as { [fieldname: string]: Express.Multer.File[] } || {})

            if (!files.images || files.images.length === 0) throw { msg: 'File tidak ditemukan', status: 404 }
            if (userId && userRole) {
                const dataUser = req.user

                req.user = {
                    ...dataUser as any,
                    id: userId as number,
                    role: userRole as string
                }
            }

            next()
        } catch (err) {
            next(err)
        }
    })
}
