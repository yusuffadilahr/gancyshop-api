import { NextFunction, Request, Response } from "express"
import { tokenSign } from "../utils/tokenJwt"

export const authRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataUser = req.user
        if (!dataUser?.id || !dataUser?.role) throw { msg: 'Data user tidak tersedia', status: 404 }

        if (dataUser?.type !== 'refresh') throw { msg: 'Akses ditolak: refresh token diperlukan.', status: 400 }
        const newAccessToken = tokenSign({ id: dataUser?.id as number, role: dataUser?.role as "USER" | "ADMIN", expires: '1h' })

        res.status(200).json({
            error: false,
            message: 'Berhasil merefresh token anda',
            data: { accessToken: newAccessToken }
        })
    } catch (error) {
        next(error)
    }
}

export const authLogoutClearCookie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataUser = req.user
        if (!dataUser?.id || !dataUser?.role) throw { msg: 'Data user tidak tersedia', status: 404 }
        if (dataUser?.type !== 'refresh') throw { msg: 'Akses ditolak: refresh token diperlukan.', status: 400 }

        res.clearCookie("_refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json({
            error: false,
            message: 'Berhasil logout',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}