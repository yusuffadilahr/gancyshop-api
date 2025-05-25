import { Router } from "express";
import { userLogin, userRegister } from "../controllers/user.controller";

export const userRoutes = Router()

userRoutes.post('/register-user', userRegister)
userRoutes.post('/login-user', userLogin)