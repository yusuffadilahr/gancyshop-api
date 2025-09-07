
import { NextFunction, Request, Response } from 'express';
import { uploadMulter } from '../utils/multer';
import { logger } from '../utils/logger';

export const uploader = (req: Request, res: Response, next: NextFunction) => {
    const uploaded = uploadMulter.fields([{ name: 'images', maxCount: 1 }])
    const userId = req.user?.id
    const userRole = req.user?.role

    uploaded(req, res, function (err) {
        try {
            console.log(err);
            
            if (err) throw { msg: 'Ada kesalahan saat mengupload file', status: 400 }

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
