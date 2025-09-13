import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";
import { uploader } from "../middlewares/uploader";
import {
  addNewUser,
  createProduct,
  deleteProductInformation,
  deleteUserById,
  getAllDataProductAdmin,
  getAllUsers,
  updateProductActive,
  updateProductInformation,
} from "../controllers/admin.controller";
import {
  adminCreateUserValidator,
  createProductValidation,
} from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";

export const adminRoute = Router();

/* ============ POST =========== */
adminRoute.post(
  "/add-products",
  verifyToken,
  checkRoleUser,
  uploader,
  createProductValidation,
  expressValidatorErrorHandling,
  createProduct
);

adminRoute.post(
  "/create-user",
  verifyToken,
  checkRoleUser,
  adminCreateUserValidator,
  expressValidatorErrorHandling,
  addNewUser
);

/* ============ PATCH =========== */
adminRoute.patch(
  "/edit-product/:idProduct",
  verifyToken,
  checkRoleUser,
  uploader,
  updateProductInformation
);

adminRoute.patch(
  "/delete-product/:idProduct",
  verifyToken,
  checkRoleUser,
  deleteProductInformation
);

adminRoute.patch(
  "/update-is-active/:idProduct",
  verifyToken,
  checkRoleUser,
  updateProductActive
);

/* ============ GET =========== */
adminRoute.get(
  "/all-products",
  verifyToken,
  checkRoleUser,
  getAllDataProductAdmin
);

adminRoute.get("/all-users", verifyToken, checkRoleUser, getAllUsers);

/* ============ DELETE =========== */
adminRoute.delete(
  "/delete-user/:idUser",
  verifyToken,
  checkRoleUser,
  deleteUserById
);
