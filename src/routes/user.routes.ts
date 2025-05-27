import { Router } from "express";
import { userLogin, userRegister, userSetPassword } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";

export const userRoutes = Router()

userRoutes.post('/register-user', userRegister)
userRoutes.post('/login-user', userLogin)

userRoutes.post('/set-password-user', verifyToken, userSetPassword)