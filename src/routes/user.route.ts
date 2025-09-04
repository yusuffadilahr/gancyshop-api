import { Router } from "express";
import { userChatByUserId, userDetail, userForgotPassword, userLogin, userRegister, userSetPassword } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { loginValidator, registerValidator } from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";
import { checkRoleUser } from "../middlewares/checkUser";

export const userRoute = Router()

/* user auth routes */
userRoute.post('/login-user', loginValidator, expressValidatorErrorHandling, userLogin)
userRoute.post('/register-user', registerValidator, expressValidatorErrorHandling, userRegister)
userRoute.post('/forgot-password-user', userForgotPassword)

/* private user route */
userRoute.post('/set-password-user', verifyToken, userSetPassword)
userRoute.get('/detail-user', verifyToken, userDetail)
userRoute.get('/chat', verifyToken, userChatByUserId)