import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";
import { uploader } from "../middlewares/uploader";
import {
  addNewUser,
  createProduct,
  createReportSales,
  deleteProductInformation,
  deleteUserById,
  getAllDataProductAdmin,
  getAllUsers,
  getReportSales,
  updateCategoryInformation,
  updateProductActive,
  updateProductInformation,
} from "../controllers/admin.controller";
import {
  adminCreateUserValidator,
  createProductValidation,
  updateCategoryValidation,
} from "../middlewares/validation";
import { expressValidatorErrorHandling } from "../middlewares/errorValidation";
import { createCategory } from "../controllers/category.controller";

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

adminRoute.post("/report", verifyToken, checkRoleUser, createReportSales);
adminRoute.post("/create-category", verifyToken, checkRoleUser, createCategory);

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

adminRoute.patch(
  "/update-category",
  updateCategoryValidation,
  expressValidatorErrorHandling,
  verifyToken,
  updateCategoryInformation
);

/* ============ GET =========== */
adminRoute.get(
  "/all-products",
  verifyToken,
  checkRoleUser,
  getAllDataProductAdmin
);

adminRoute.get("/all-users", verifyToken, checkRoleUser, getAllUsers);
adminRoute.get("/report", verifyToken, checkRoleUser, getReportSales);

/* ============ DELETE =========== */
adminRoute.delete(
  "/delete-user/:idUser",
  verifyToken,
  checkRoleUser,
  deleteUserById
);
