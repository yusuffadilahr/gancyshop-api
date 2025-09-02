import { NextFunction, Request, Response } from "express";
import { tokenVerify } from "../utils/tokenJwt";
import { ITokenVerify } from "../types";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers

        if (!authorization) throw { msg: 'Token tidak valid', status: 401 }

        const tokenUser = authorization?.split(' ')[1] as string

        const dataUser = tokenVerify(tokenUser) as ITokenVerify
        if (dataUser) {
            req.user = dataUser

            return next()
        } else {
            throw { msg: 'Token tidak valid', status: 401 };
        }
    } catch (error) {
        next(error)
    }
}

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookieStore = req.cookies
        const tokenRefresh = cookieStore?._refreshToken

        if (!tokenRefresh) throw { msg: 'Token tidak valid', status: 401 }

        const dataUser = tokenVerify(tokenRefresh) as ITokenVerify
        if (dataUser) {
            req.user = dataUser
            return next()
        } else {
            throw { msg: 'Token tidak valid', status: 401 };
        }
    } catch (error) {
        next(error)
    }
}