import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { addToCart, getShoppingCartUser } from "../controllers/cart.controller";
import { addToCartValidation } from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";
import { checkRoleOnlyUser } from "../middlewares/checkUser";

export const cartRoute = Router();
cartRoute.post(
  "/add-to-cart",
  verifyToken,
  addToCartValidation,
  expressValidatorErrorHandling,
  addToCart
);

cartRoute.get(
  "/cart-user",
  verifyToken,
  checkRoleOnlyUser,
  getShoppingCartUser
);
