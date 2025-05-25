import { NextFunction, Request, Response } from "express";

export const checkRoleUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        console.log(authorization, '<<<<')
    } catch (error) {
        next(error)
    }
}