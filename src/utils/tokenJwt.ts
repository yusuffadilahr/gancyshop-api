import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ITokenVerify } from '../types';

config()

const jwtSecretKey = process.env.JWT_SECRET_KEY as string
export const tokenVerify = (token: string): ITokenVerify => {
    try {
        const decoded = jwt.verify(token, jwtSecretKey) as ITokenVerify;
        return decoded;
    } catch (error: any) {
        if (error.name === "TokenExpiredError") throw { msg: "Token expired", status: 401 }
        throw { msg: "Token tidak valid", status: 401 }
    }
};

export const tokenSign = ({ id, role, expires = '5m' }: { id: number, role: 'USER' | 'ADMIN', expires?: any }) => {
    return jwt.sign({ id, role }, jwtSecretKey, { expiresIn: expires })
}

export const refrestTokenSign = ({ id, role }: { id: number, role: 'USER' | 'ADMIN' }) => {
    return jwt.sign({ id, role, type: 'refresh' }, jwtSecretKey, { expiresIn: '30d' })
}