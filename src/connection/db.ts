import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const dbConnect = async (): Promise<void> => {
    try {
        await prisma.$connect()
        console.log('db connect')
    } catch (error) {
        console.log(error, 'Database tidak terhubung')
    }
}

export default prisma