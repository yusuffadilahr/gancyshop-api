import { Router } from "express";
import { userRoute } from "./user.route";
import { productRoute } from "./product.route";
import { adminRoute } from "./admin.route";
import { categoryRoute } from "./category.route";
import { authRoute } from "./auth.route";
import { cartRoute } from "./cart.route";
import { publicRoute } from "./public.route";

const router = Router();

router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/admin", adminRoute);
router.use("/category", categoryRoute);
router.use("/auth", authRoute);
router.use("/cart", cartRoute);

// public route
router.use("/public", publicRoute);

export default router;
