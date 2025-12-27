import { Router } from "express";
import { getCategoryForFilterProductPublic } from "../controllers/category.controller";

export const categoryRoute = Router();
categoryRoute.get("/all-category-product", getCategoryForFilterProductPublic);
