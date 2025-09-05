import { Router } from "express";
import {
  getAllProductPublic,
  getCategoryForFilterProductPublic,
  getProductByIdPublic,
} from "../controllers/product.controller";
import { verifyToken } from "../middlewares/verifyToken";

export const productRoute = Router();

productRoute.get("/all-product", getAllProductPublic);
productRoute.get("/all-category-product", getCategoryForFilterProductPublic);
productRoute.get(
  "/single-product/:idProduct",
  verifyToken,
  getProductByIdPublic
);
