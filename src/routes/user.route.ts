import { Router } from "express";
import { userChatByUserId, userDetail, userForgotPassword, userLogin, userRegister, userSetPassword } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";

export const userRoute = Router()

userRoute.post('/register-user', userRegister)
userRoute.post('/login-user', userLogin)
userRoute.get('/detail-user', verifyToken, userDetail)

userRoute.post('/set-password-user', verifyToken, userSetPassword)
userRoute.post('/forgot-password-user', userForgotPassword)

userRoute.get('/chat', verifyToken, userChatByUserId)