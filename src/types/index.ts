export interface ITokenVerify {
    id: number,
    role: string,
    type?: string
    iat: number,
    exp: number
}

export interface IUserRegisterService {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    password: string
}

export interface IUserLoginService {
    email: string
    password: string
}

export interface IUserSetPasswordService {
    password: string,
    userId: number,
    tokenRequest: string
}