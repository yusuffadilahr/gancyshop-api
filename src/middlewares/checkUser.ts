import { NextFunction, Request, Response } from "express";
import { ITokenVerify } from "../types";
import { tokenVerify } from "../utils/tokenJwt";

export const checkRoleUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const role = req.user?.role
        console.log(role, '<<<')

        const tokenUser = authorization?.split(' ')[1] as string
        const dataUser = tokenVerify(tokenUser) as ITokenVerify
        
        if (role !== 'ADMIN') throw { msg: 'Anda tidak dapat mengakses, anda bukan admin', status: 400 }
        if (dataUser && dataUser.id) req.user = dataUser

        next()
    } catch (error) {
        console.log(error, '<<')
        next(error)
    }
}