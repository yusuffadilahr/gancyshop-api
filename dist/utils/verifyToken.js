"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSign = exports.verifyToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwtSecretKey);
};
exports.verifyToken = verifyToken;
const tokenSign = ({ id, role }) => {
    return jsonwebtoken_1.default.sign({ id, role }, jwtSecretKey, { expiresIn: '1d' });
};
exports.tokenSign = tokenSign;
