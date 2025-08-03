import { readFileSync } from "fs"
import { refrestTokenSign, tokenSign } from "../utils/tokenJwt"
import { compile } from "handlebars"
import prisma from "../connection/db"
import { comparePassword, hashPassword } from "../utils/hashPassword"
import { transport } from "../utils/transporter"
import { checkEmail } from "../utils/checkInput"
import { IUserLoginService, IUserRegisterService, IUserSetPasswordService } from "../types"

export const userRegisterService = async ({
    email,
    firstName,
    lastName,
    phoneNumber,
}: IUserRegisterService) => {
    const findUserExist = await prisma.user.findFirst({ where: { email } })
    if (findUserExist) throw { msg: 'Email sudah terpakai oleh pengguna lainnya', status: 400 }

    const hashedPassword = await hashPassword('@Huah!aha123')
    await prisma.$transaction(async (tx) => {
        const dataUser = await tx.user.create({
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

        const setToken = tokenSign({ id: Number(dataUser.id), role: dataUser.role })
        const readFileHtml = readFileSync('./src/public/emailHtml/verification.html', 'utf-8')

        let compiledHtml: any = compile(readFileHtml)
        compiledHtml = compiledHtml({
            url: `http://localhost:3000/set-password-user/${setToken}`,
            nama: firstName
        })

        const update = await tx.user.update({
            where: { id: dataUser.id },
            data: {
                tokenUpdatePassword: setToken,
            }
        })

        if (!update) throw { msg: 'Ada proses yang gagal, silahkan tunggu.', status: 400 }

        await transport.sendMail({
            to: email,
            html: compiledHtml
        })

    }, {
        maxWait: 5000,
        timeout: 10000
    })

}

export const userLoginService = async ({
    email, password
}: IUserLoginService) => {
    if (!email || !password) throw { msg: 'Isi data terlebih dahulu', status: 400 }
    if (!checkEmail(email)) throw { msg: 'Format Email tidak valid', status: 400 }

    const findUserByEmail = await prisma.user.findFirst({ where: { email } })
    if (!findUserByEmail) throw { msg: 'User tidak tersedia, atau email salah', status: 404 }

    const match = await comparePassword({ password, existingPassword: findUserByEmail.password })
    if (!match) throw { msg: 'Password anda salah', status: 400 }

    const setToken = tokenSign({ id: findUserByEmail.id, role: findUserByEmail.role })
    const setRefreshToken = refrestTokenSign({ id: findUserByEmail.id, role: findUserByEmail.role })

    return { token: setToken, findUserByEmail, refreshToken: setRefreshToken }
}

export const userSetPasswordService = async ({
    password,
    userId,
    tokenRequest
}: IUserSetPasswordService) => {
    if (!password) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
    const findUserById = await prisma.user.findFirst({
        where: {
            AND: [
                { id: userId },
                { isUpdatePassword: false },
            ]
        }
    })

    if (findUserById?.tokenUpdatePassword !== tokenRequest) throw { msg: 'Link sudah tidak berlaku, silahkan kirim ulang permintaan', status: 400 }
    if (!findUserById) throw { msg: 'Permintaan ubah password sudah digunakan. Silakan kirim ulang permintaan untuk mengganti password lagi.' }

    const response = await prisma.user.update({
        where: { id: userId },
        data: {
            password: await hashPassword(password),
            tokenUpdatePassword: null,
            isUpdatePassword: true
        }
    })

    return { response }
}

export const userForgotPasswordService = async (email: string) => {
    if (!email) throw { msg: 'Email wajib diisi', status: 400 }
    if (!checkEmail(email)) throw { msg: 'Format email tidak sesuai', status: 400 }

    const findUserByEmail = await prisma.user.findFirst({
        where: { email }
    })

    if (!findUserByEmail) throw { msg: 'User tidak tersedia', status: 404 }

    const setToken = tokenSign({ id: findUserByEmail.id, role: findUserByEmail.role })

    await prisma.user.update({
        where: { id: findUserByEmail.id },
        data: {
            isUpdatePassword: false,
            tokenUpdatePassword: setToken
        }
    })

    const readFileHtml = readFileSync('./src/public/emailHtml/forgotPassword.html', 'utf-8')
    let compiledHtml: any = compile(readFileHtml)
    compiledHtml = compiledHtml({
        url: `http://localhost:3000/set-password-user/${setToken}`,
        nama: findUserByEmail.firstName
    })

    await transport.sendMail({
        to: email,
        html: compiledHtml
    })
}