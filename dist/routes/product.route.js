"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
exports.productRoute = (0, express_1.Router)();
exports.productRoute.get('/all-product', product_controller_1.getAllProductPublic);
exports.productRoute.get('/all-category-product', product_controller_1.getCategoryForFilterProductPublic);
exports.productRoute.get('/single-product/:idProduct', product_controller_1.getProductByIdPublic);
