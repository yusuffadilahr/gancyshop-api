import { Router } from "express";
import { getCategoryForFilterProductPublic } from "../controllers/category.controller";
import { userForgotPassword } from "../controllers/user.controller";
import { getAllProductPublic } from "../controllers/product.controller";
import { forgotPasswordValidation } from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";

export const publicRoute = Router();

/* ============ GET =========== */
publicRoute.get("/all-category-product", getCategoryForFilterProductPublic);
publicRoute.get("/all-product", getAllProductPublic);

/* ============ POST =========== */
publicRoute.post(
  "/forgot-password-user",
  forgotPasswordValidation,
  expressValidatorErrorHandling,
  userForgotPassword
);
