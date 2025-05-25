
import { NextFunction, Request, Response } from 'express';
import { uploadMulter } from '../utils/multer';

export const uploader = (req: Request, res: Response, next: NextFunction) => {
    const uploaded = uploadMulter.fields([{ name: 'images', maxCount: 3 }])
    // const { usersId, authorizationRole } = req.body

    uploaded(req, res, function (err) {
        try {
            if (err) throw { msg: err.message, status: err.status }

            if (!Array.isArray(req?.files) && !req?.files?.images?.length) throw { msg: 'File Tidak Ditemukan', status: 404 }
            // if (usersId && authorizationRole) {
            //     req.body.usersId = usersId
            //     req.body.authrorizationRole = authorizationRole
            // }

            next()
        } catch (err) {
            next(err)
        }
    })
}
