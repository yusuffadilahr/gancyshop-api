import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";
import { uploader } from "../middlewares/uploader";
import { createProduct, getAllDataProductAdmin, updateProductActive } from "../controllers/admin.controller";

export const adminRoute = Router()

adminRoute.post('/add-products', verifyToken, checkRoleUser, uploader, createProduct)
adminRoute.get('/all-products', verifyToken, checkRoleUser, getAllDataProductAdmin)
adminRoute.patch('/update-is-active/:idProduct', verifyToken, checkRoleUser, updateProductActive)