import { readFileSync } from "fs"
import { tokenSign } from "../utils/verifyToken"
import { compile } from "handlebars"
import prisma from "../connection/db"
import { hashPassword } from "../utils/hashPassword"
import { transport } from "../utils/transporter"

interface IUserRegisterService {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
}

export const userRegisterService = async ({
    email,
    firstName,
    lastName,
    phoneNumber,
}: IUserRegisterService) => {
    const findUserExist = await prisma.user.findFirst({ where: { email } })
    if (findUserExist) throw { msg: 'Email sudah terpakai oleh pengguna lainnya', status: 400 }

    const hashedPassword = await hashPassword('@Huah!aha123')
    const dataUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            role: 'USER',
            isUpdatePassword: false
        }
    })

    const setToken = tokenSign({ id: String(dataUser.id), role: dataUser.role })
    const readFileHtml = readFileSync('./src/public/emailHtml/verification.html', 'utf-8')

    let compiledHtml: any = compile(readFileHtml)
    compiledHtml = compiledHtml({
        url: `http://localhost:3000/set-password-user/${setToken}`,
        nama: firstName
    })

    await transport.sendMail({
        to: email,
        html: compiledHtml
    })
}