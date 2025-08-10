"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refrestTokenSign = exports.tokenSign = exports.tokenVerify = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const tokenVerify = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
    return decoded;
};
exports.tokenVerify = tokenVerify;
const tokenSign = ({ id, role, expires = '5m' }) => {
    return jsonwebtoken_1.default.sign({ id, role }, jwtSecretKey, { expiresIn: expires });
};
exports.tokenSign = tokenSign;
const refrestTokenSign = ({ id, role }) => {
    return jsonwebtoken_1.default.sign({ id, role, type: 'refresh' }, jwtSecretKey, { expiresIn: '30d' });
};
exports.refrestTokenSign = refrestTokenSign;
