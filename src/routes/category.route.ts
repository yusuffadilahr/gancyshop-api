import { Router } from "express";
import { createCategory, getCategoryMotorCycle, getCategoryProduct } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";

export const categoryRoutes = Router()

// private
categoryRoutes.get('/all-category-motorcycle', verifyToken, checkRoleUser, getCategoryMotorCycle)
categoryRoutes.get('/all-category/:categoryMotorId', verifyToken, checkRoleUser, getCategoryProduct)

categoryRoutes.post('/create-category', verifyToken, checkRoleUser, createCategory)