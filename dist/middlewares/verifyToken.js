"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const tokenJwt_1 = require("../utils/tokenJwt");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const tokenUser = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const dataUser = (0, tokenJwt_1.tokenVerify)(tokenUser);
        if (dataUser && dataUser.id) {
            req.user = dataUser;
            return next();
        }
        else {
            throw { msg: 'Token tidak valid', status: 401 };
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyToken = verifyToken;
