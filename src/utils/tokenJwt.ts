import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

config()

const jwtSecretKey = process.env.JWT_SECRET_KEY as string
export const tokenVerify = (token: string) => {
    const decoded = jwt.verify(token, jwtSecretKey)
    return decoded
}

export const tokenSign = ({ id, role }: { id: number, role: 'USER' | 'ADMIN' }) => {
    return jwt.sign({ id, role }, jwtSecretKey, { expiresIn: '1d' })
}