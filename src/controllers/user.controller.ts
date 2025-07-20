import { NextFunction, Request, Response } from "express"
import { checkCharacter, checkEmail, checkNumberInput } from "../utils/checkInput"
import { userForgotPasswordService, userLoginService, userRegisterService, userSetPasswordService } from "../services/user.service"
import prisma from "../connection/db"
import { Role } from "@prisma/client"

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body

        if (!firstName || !lastName || !email || !phoneNumber) throw { msg: 'Harap diisi terlebih dahulu', status: 404 }
        if (!checkCharacter(firstName) || !checkCharacter(lastName)) throw { msg: 'Nama tidak boleh mengandung karakter atau angka', status: 400 }
        if (!checkNumberInput(phoneNumber)) throw { msg: 'No Telpon hanya berupa angka 0-9', status: 400 }
        if (!checkEmail(email)) throw { msg: 'Format email salah', status: 400 }

        await userRegisterService({ email, firstName, lastName, phoneNumber })

        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil membuat akun, silahkan cek email untuk set password'
        })
    } catch (error) {
        next(error)
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const { token, findUserByEmail } = await userLoginService({ email, password })

        res.status(200).json({
            error: false,
            data: {
                token,
                role: findUserByEmail.role,
                fullName: `${findUserByEmail.firstName} ${findUserByEmail.lastName}`
            },
            message: 'Berhasil melakukan login'
        })
    } catch (error) {
        next(error)
    }
}

export const userSetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const userId = req.user?.id
        const { password } = req.body
        const tokenRequest = authorization?.split(' ')[1]

        const { response } = await userSetPasswordService({ password, tokenRequest: tokenRequest as string, userId: userId as number })

        res.status(200).json({
            error: false,
            data: {},
            message: `Hi ${response.firstName}, Kamu berhasil merubah password. silahkan masuk..`
        })

    } catch (error) {
        next(error)
    }
}

export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        await userForgotPasswordService(email)

        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil mengirim ulang, harap melakukan pengecekan email anda secara berkala'
        })
    } catch (error) {
        next(error)
    }
}

export const userDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id

        const findUserById = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (!findUserById) throw { msg: 'User tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            data: {
                fullname: `${findUserById.firstName} ${findUserById.lastName}`,
                phoneNumber: findUserById.phoneNumber,
                email: findUserById.email
            },
            message: 'Berhasil mendapatkan data'
        })
    } catch (error) {
        next(error)
    }
}

export const userChatByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataUser = req?.user

        if (!dataUser?.id) throw { msg: 'Data user tidak tersedia', status: 404 }

        const findChat = await prisma.messageCustomer.findMany({
            where: { userId: Number(dataUser?.id) },
            orderBy: { createdAt: 'asc' }
        })

        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data chat',
            data: findChat || []
        })

    } catch (error) {
        next(error)
    }
}