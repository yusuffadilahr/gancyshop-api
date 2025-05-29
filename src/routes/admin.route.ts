import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";
import { uploader } from "../middlewares/uploader";
import { createProduct } from "../controllers/admin.controller";

export const adminRoute = Router()

adminRoute.post('/add-products', verifyToken, checkRoleUser, uploader, createProduct)