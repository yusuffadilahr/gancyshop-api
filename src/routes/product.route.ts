import { Router } from "express";
import { getAllProductPublic, getCategoryForFilterProductPublic } from "../controllers/product.controller";

export const productRoute = Router()

productRoute.get('/all-product', getAllProductPublic)
productRoute.get('/all-category-product', getCategoryForFilterProductPublic)