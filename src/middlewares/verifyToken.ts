import { NextFunction, Request, Response } from "express";
import { tokenVerify } from "../utils/tokenJwt";
import { JwtPayload } from "jsonwebtoken";

interface ITokenVerify {
    id: string,
    role: string,
    iat: number,
    exp: number
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers

        const tokenUser = authorization?.split(' ')[1]

        const dataUser: JwtPayload = tokenVerify(tokenUser as string) as JwtPayload
        if (!!dataUser) {
            req.body.userId = dataUser.id
            req.body.userRole = dataUser.role
        }

        next()
    } catch (error) {
        next(error)
    }
}