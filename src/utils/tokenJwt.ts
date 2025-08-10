import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

config()

const jwtSecretKey = process.env.JWT_SECRET_KEY as string
export const tokenVerify = (token: string) => {
    const decoded = jwt.verify(token, jwtSecretKey)
    return decoded
}

export const tokenSign = ({ id, role, expires = '5m' }: { id: number, role: 'USER' | 'ADMIN', expires?: any }) => {
    return jwt.sign({ id, role }, jwtSecretKey, { expiresIn: expires })
}

export const refrestTokenSign = ({ id, role }: { id: number, role: 'USER' | 'ADMIN' }) => {
    return jwt.sign({ id, role, type: 'refresh' }, jwtSecretKey, { expiresIn: '30d' })
}