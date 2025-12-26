import { Router } from "express";
import {
  createCategory,
  getCategoryForFilterProductPublic,
  getCategoryMotorCycle,
  getCategoryProduct,
  getCategoryProductById,
} from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";

export const categoryRoute = Router();

// private, for admin
categoryRoute.get(
  "/all-category-motorcycle",
  verifyToken,
  checkRoleUser,
  getCategoryMotorCycle
);

categoryRoute.get(
  "/all-category/:categoryMotorId",
  verifyToken,
  checkRoleUser,
  getCategoryProductById
);

categoryRoute.get(
  "/all-categorys",
  verifyToken,
  checkRoleUser,
  getCategoryProduct
);

// public
categoryRoute.get("/all-category-product", getCategoryForFilterProductPublic);
