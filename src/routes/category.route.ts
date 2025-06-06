import { Router } from "express";
import { getCategoryMotorCycle, getCategoryProduct } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";

export const categoryRoutes = Router()

// private
categoryRoutes.get('/all-category-motorcycle', verifyToken, checkRoleUser, getCategoryMotorCycle)
categoryRoutes.get('/all-category/:categoryMotorId', verifyToken, checkRoleUser, getCategoryProduct)