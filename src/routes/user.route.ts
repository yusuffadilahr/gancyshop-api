import { Router } from "express";
import {
  userChatByUserId,
  userDetail,
  userForgotPassword,
  userLogin,
  userRegister,
  userSetPassword,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import {
  forgotPasswordValidation,
  loginValidator,
  registerValidator,
} from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";
import { checkRoleUser } from "../middlewares/checkUser";

export const userRoute = Router();

/* user auth routes */
userRoute.post(
  "/login-user",
  loginValidator,
  expressValidatorErrorHandling,
  userLogin
);

userRoute.post(
  "/register-user",
  registerValidator,
  expressValidatorErrorHandling,
  userRegister
);

// public
userRoute.post(
  "/forgot-password-user",
  forgotPasswordValidation,
  expressValidatorErrorHandling,
  userForgotPassword
);

/* private user route */
userRoute.post("/set-password-user", verifyToken, userSetPassword);
userRoute.get("/detail-user", verifyToken, userDetail);
userRoute.get("/chat", verifyToken, userChatByUserId);
