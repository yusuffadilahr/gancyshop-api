import { NextFunction, Request, Response } from "express";
import { tokenVerify } from "../utils/tokenJwt";
import { ITokenVerify } from "../types";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const tokenUser = authorization?.split(' ')[1] as string

        const dataUser = tokenVerify(tokenUser) as ITokenVerify
        if (dataUser && dataUser.id) {
            req.user = dataUser
            
            return next()
        } else {
            throw { msg: 'Token tidak valid', status: 401 };
        }
    } catch (error) {
        next(error)
    }
}