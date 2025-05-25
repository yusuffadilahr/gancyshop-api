import { NextFunction, Request, Response } from "express"
import { checkCharacter, checkEmail, checkNumberInput } from "../utils/checkInput"
import { userRegisterService } from "../services/user.service"
import prisma from "../connection/db"
import { comparePassword } from "../utils/hashPassword"
import { tokenSign } from "../utils/verifyToken"

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body

        if (!firstName || !lastName || !email || !phoneNumber) throw { msg: 'Harap diisi terlebih dahulu', status: 404 }
        if (!checkCharacter(firstName) || !checkCharacter(lastName)) throw { msg: 'Tidak boleh mengandung karakter', status: 400 }
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
        console.log(email, '<<<')
        if (!email || !password) throw { msg: 'Isi data terlebih dahulu', status: 400 }
        if (!checkEmail(email)) throw { msg: 'Format Email tidak valid', status: 400 }

        const findUserByEmail = await prisma.user.findFirst({ where: { email } })
        if (!findUserByEmail) throw { msg: 'User tidak tersedia, atau email salah', status: 404 }

        const match = await comparePassword({ password, existingPassword: findUserByEmail.password })
        if (!match) throw { msg: 'Password anda salah', status: 400 }

        const setToken = tokenSign({ id: findUserByEmail.email, role: findUserByEmail.role })

        res.status(200).json({
            error: false,
            data: {
                token: setToken,
                role: findUserByEmail.role,
                fullName: `${findUserByEmail.firstName} ${findUserByEmail.lastName}`
            },
            message: 'Berhasil melakukan login'
        })
    } catch (error) {
        next(error)
    }
}

// export const use