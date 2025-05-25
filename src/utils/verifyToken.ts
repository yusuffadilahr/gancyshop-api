import { config } from 'dotenv'
import jwt from 'jsonwebtoken'

config()
const jwtSecretKey = process.env.JWT_SECRET_KEY as string
export const verifyToken = (token: string) => {
    return jwt.verify(token, jwtSecretKey)
}

export const tokenSign = ({ id, role }: { id: string, role: 'USER' | 'ADMIN' }) => {
    return jwt.sign({ id, role }, jwtSecretKey, { expiresIn: '1d' })
}