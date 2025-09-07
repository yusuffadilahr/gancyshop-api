import { Router } from "express";
import {
  getAllProductPublic,
  getProductByIdPublic,
} from "../controllers/product.controller";
import { verifyToken } from "../middlewares/verifyToken";

export const productRoute = Router();

// public
productRoute.get("/all-product", getAllProductPublic);

// private
productRoute.get(
  "/single-product/:idProduct",
  verifyToken,
  getProductByIdPublic
);
