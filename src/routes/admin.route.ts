import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { checkRoleUser } from "../middlewares/checkUser";
import { uploader } from "../middlewares/uploader";
import {
  createProduct,
  deleteProductInformation,
  deleteUserById,
  getAllDataProductAdmin,
  getAllUsers,
  updateProductActive,
  updateProductInformation,
} from "../controllers/admin.controller";

export const adminRoute = Router();

adminRoute.post(
  "/add-products",
  verifyToken,
  checkRoleUser,
  uploader,
  createProduct
);
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

adminRoute.get(
  "/all-products",
  verifyToken,
  checkRoleUser,
  getAllDataProductAdmin
);

adminRoute.patch(
  "/update-is-active/:idProduct",
  verifyToken,
  checkRoleUser,
  updateProductActive
);

adminRoute.get("/all-users", verifyToken, checkRoleUser, getAllUsers);
adminRoute.delete(
  "/delete-user/:idUser",
  verifyToken,
  checkRoleUser,
  deleteUserById
);
