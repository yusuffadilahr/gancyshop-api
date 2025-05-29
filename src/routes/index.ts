import { Router } from "express";
import { userRoute } from "./user.route";
import { productRoute } from "./product.route";
import { adminRoute } from "./admin.route";

const router = Router()

router.use('/user', userRoute)
router.use('/product', productRoute)
router.use('/admin', adminRoute)

export default router