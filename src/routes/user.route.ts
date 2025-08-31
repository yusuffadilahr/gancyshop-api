import { Router } from "express";
import { userChatByUserId, userDetail, userForgotPassword, userLogin, userRegister, userSetPassword } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { loginValidator } from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";

export const userRoute = Router()

/* user auth routes */
userRoute.post('/login-user', loginValidator, expressValidatorErrorHandling, userLogin)
userRoute.post('/register-user', userRegister)
// userRoute.get('/refresh-token/:tokenRefresh', userRefreshToken)
// userRoute.get('/refresh', verifyToken, userRefreshToken)
userRoute.post('/set-password-user', verifyToken, userSetPassword)
userRoute.post('/forgot-password-user', userForgotPassword)

userRoute.get('/detail-user', verifyToken, userDetail)
userRoute.get('/chat', verifyToken, userChatByUserId)