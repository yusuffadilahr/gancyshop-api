"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const checkUser_1 = require("../middlewares/checkUser");
exports.categoryRoutes = (0, express_1.Router)();
// private
exports.categoryRoutes.get('/all-category-motorcycle', verifyToken_1.verifyToken, checkUser_1.checkRoleUser, category_controller_1.getCategoryMotorCycle);
exports.categoryRoutes.get('/all-category/:categoryMotorId', verifyToken_1.verifyToken, checkUser_1.checkRoleUser, category_controller_1.getCategoryProductById);
exports.categoryRoutes.get('/all-categorys', verifyToken_1.verifyToken, checkUser_1.checkRoleUser, category_controller_1.getCategoryProduct);
exports.categoryRoutes.post('/create-category', verifyToken_1.verifyToken, checkUser_1.checkRoleUser, category_controller_1.createCategory);
