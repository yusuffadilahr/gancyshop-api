import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authRefreshToken } from "../controllers/auth.controller";

export const authRoute = Router()

authRoute.get('/refresh', verifyToken, authRefreshToken)
