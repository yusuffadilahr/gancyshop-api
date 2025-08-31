import { NextFunction, Request, Response } from "express"
import { tokenSign } from "../utils/tokenJwt"

export const authRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataUser = req.user
        if (!dataUser?.id || !dataUser?.role) throw { msg: 'Data user tidak tersedia', status: 404 }

        const newAccessToken = tokenSign({ id: dataUser?.id as number, role: dataUser?.role as "USER" | "ADMIN", expires: '12h' })
        // const newRefreshToken = refrestTokenSign({ id: dataUser?.id as number, role: dataUser?.role as "USER" | "ADMIN" })

        res.status(200).json({
            error: false,
            message: 'Berhasil merefresh token anda',
            data: { accessToken: newAccessToken }
        })
    } catch (error) {
        next(error)
    }
}