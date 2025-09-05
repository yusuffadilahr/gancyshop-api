import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { addToCart } from "../controllers/cart.controller";
import { addToCartValidation } from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";

export const cartRoute = Router();
cartRoute.post(
  "/add-to-cart",
  verifyToken,
  addToCartValidation,
  expressValidatorErrorHandling,
  addToCart
);
