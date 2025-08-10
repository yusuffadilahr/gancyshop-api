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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChatByUserId = exports.userDetail = exports.userForgotPassword = exports.userSetPassword = exports.userRefreshToken = exports.userLogin = exports.userRegister = void 0;
const checkInput_1 = require("../utils/checkInput");
const user_service_1 = require("../services/user.service");
const db_1 = __importDefault(require("../connection/db"));
const tokenJwt_1 = require("../utils/tokenJwt");
const userRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber)
            throw { msg: 'Harap diisi terlebih dahulu', status: 404 };
        if (!(0, checkInput_1.checkCharacter)(firstName) || !(0, checkInput_1.checkCharacter)(lastName))
            throw { msg: 'Nama tidak boleh mengandung karakter atau angka', status: 400 };
        if (!(0, checkInput_1.checkNumberInput)(phoneNumber))
            throw { msg: 'No Telpon hanya berupa angka 0-9', status: 400 };
        if (!(0, checkInput_1.checkEmail)(email))
            throw { msg: 'Format email salah', status: 400 };
        yield (0, user_service_1.userRegisterService)({ email, firstName, lastName, phoneNumber });
        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil membuat akun, silahkan cek email untuk set password'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userRegister = userRegister;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { token, findUserByEmail, refreshToken } = yield (0, user_service_1.userLoginService)({ email, password });
        res.status(200).json({
            error: false,
            data: {
                token,
                refreshToken,
                role: findUserByEmail.role,
                fullName: `${findUserByEmail.firstName} ${findUserByEmail.lastName}`
            },
            message: 'Berhasil melakukan login'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
const userRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenRefresh } = req.params;
        const dataUser = (0, tokenJwt_1.tokenVerify)(tokenRefresh);
        const newAccessToken = (0, tokenJwt_1.tokenSign)({ id: dataUser === null || dataUser === void 0 ? void 0 : dataUser.id, role: dataUser === null || dataUser === void 0 ? void 0 : dataUser.role, expires: '15m' });
        const newRefreshToken = (0, tokenJwt_1.refrestTokenSign)({ id: dataUser === null || dataUser === void 0 ? void 0 : dataUser.id, role: dataUser === null || dataUser === void 0 ? void 0 : dataUser.role });
        res.status(200).json({
            error: false,
            message: 'Berhasil merefresh token anda',
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userRefreshToken = userRefreshToken;
const userSetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { authorization } = req.headers;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { password } = req.body;
        const tokenRequest = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const { response } = yield (0, user_service_1.userSetPasswordService)({ password, tokenRequest: tokenRequest, userId: userId });
        res.status(200).json({
            error: false,
            data: {},
            message: `Hi ${response.firstName}, Kamu berhasil merubah password. silahkan masuk..`
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userSetPassword = userSetPassword;
const userForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, user_service_1.userForgotPasswordService)(email);
        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil mengirim ulang, harap melakukan pengecekan email anda secara berkala'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userForgotPassword = userForgotPassword;
const userDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const findUserById = yield db_1.default.user.findFirst({
            where: { id: userId }
        });
        if (!findUserById)
            throw { msg: 'User tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            data: {
                fullname: `${findUserById.firstName} ${findUserById.lastName}`,
                phoneNumber: findUserById.phoneNumber,
                email: findUserById.email
            },
            message: 'Berhasil mendapatkan data'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userDetail = userDetail;
const userChatByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataUser = req === null || req === void 0 ? void 0 : req.user;
        if (!(dataUser === null || dataUser === void 0 ? void 0 : dataUser.id))
            throw { msg: 'Data user tidak tersedia', status: 404 };
        const findChat = yield db_1.default.messagecustomer.findMany({
            where: { userId: Number(dataUser === null || dataUser === void 0 ? void 0 : dataUser.id) },
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data chat',
            data: findChat || []
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userChatByUserId = userChatByUserId;
