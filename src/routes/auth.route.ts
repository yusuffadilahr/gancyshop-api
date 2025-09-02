import { Router } from "express";
import { authLogoutClearCookie, authRefreshToken } from "../controllers/auth.controller";
import { verifyRefreshToken } from "../middlewares/verifyToken";

export const authRoute = Router()

// auth with credentials cookie httpOnly
authRoute.get('/refresh', verifyRefreshToken, authRefreshToken)
authRoute.get('/logout', verifyRefreshToken, authLogoutClearCookie)