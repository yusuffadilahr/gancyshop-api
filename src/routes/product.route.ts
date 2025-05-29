import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getAllProduct } from "../controllers/product.controller";
import { checkRoleUser } from "../middlewares/checkUser";

export const productRoute = Router()

productRoute.get('/product-admin', verifyToken, checkRoleUser, getAllProduct)