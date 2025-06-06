import { Router } from "express";
import { getAllProductPublic } from "../controllers/product.controller";

export const productRoute = Router()

productRoute.get('/all-product', getAllProductPublic)