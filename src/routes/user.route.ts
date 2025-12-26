import { Router } from "express";
import {
  userChatByUserId,
  userDetail,
  userForgotPassword,
  userLogin,
  userRegister,
  userSetPassword,
  userSubscription,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import {
  forgotPasswordValidation,
  loginValidator,
  registerValidator,
  subcriptionValidation,
} from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";

export const userRoute = Router();

/* user auth routes */
userRoute.post(
  "/login-user",
  loginValidator,
  expressValidatorErrorHandling,
  userLogin
);

// auth gancy thrift
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

userRoute.post(
  "/subcription",
  subcriptionValidation,
  expressValidatorErrorHandling,
  verifyToken,
  userSubscription
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
