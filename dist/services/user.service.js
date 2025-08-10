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
exports.userForgotPasswordService = exports.userSetPasswordService = exports.userLoginService = exports.userRegisterService = void 0;
const fs_1 = require("fs");
const tokenJwt_1 = require("../utils/tokenJwt");
const handlebars_1 = require("handlebars");
const db_1 = __importDefault(require("../connection/db"));
const hashPassword_1 = require("../utils/hashPassword");
const transporter_1 = require("../utils/transporter");
const checkInput_1 = require("../utils/checkInput");
const userRegisterService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, firstName, lastName, phoneNumber, }) {
    const findUserExist = yield db_1.default.user.findFirst({ where: { email } });
    if (findUserExist)
        throw { msg: 'Email sudah terpakai oleh pengguna lainnya', status: 400 };
    const hashedPassword = yield (0, hashPassword_1.hashPassword)('@Huah!aha123');
    yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUser = yield tx.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                role: 'USER',
                isUpdatePassword: false
            }
        });
        const setToken = (0, tokenJwt_1.tokenSign)({ id: Number(dataUser.id), role: dataUser.role });
        const readFileHtml = (0, fs_1.readFileSync)('./src/public/emailHtml/verification.html', 'utf-8');
        let compiledHtml = (0, handlebars_1.compile)(readFileHtml);
        compiledHtml = compiledHtml({
            url: `http://localhost:3000/set-password-user/${setToken}`,
            nama: firstName
        });
        const update = yield tx.user.update({
            where: { id: dataUser.id },
            data: {
                tokenUpdatePassword: setToken,
            }
        });
        if (!update)
            throw { msg: 'Ada proses yang gagal, silahkan tunggu.', status: 400 };
        yield transporter_1.transport.sendMail({
            to: email,
            html: compiledHtml
        });
    }), {
        maxWait: 5000,
        timeout: 10000
    });
});
exports.userRegisterService = userRegisterService;
const userLoginService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    if (!email || !password)
        throw { msg: 'Isi data terlebih dahulu', status: 400 };
    if (!(0, checkInput_1.checkEmail)(email))
        throw { msg: 'Format Email tidak valid', status: 400 };
    const findUserByEmail = yield db_1.default.user.findFirst({ where: { email } });
    if (!findUserByEmail)
        throw { msg: 'User tidak tersedia, atau email salah', status: 404 };
    const match = yield (0, hashPassword_1.comparePassword)({ password, existingPassword: findUserByEmail.password });
    if (!match)
        throw { msg: 'Password anda salah', status: 400 };
    const setToken = (0, tokenJwt_1.tokenSign)({ id: findUserByEmail.id, role: findUserByEmail.role });
    const setRefreshToken = (0, tokenJwt_1.refrestTokenSign)({ id: findUserByEmail.id, role: findUserByEmail.role });
    return { token: setToken, findUserByEmail, refreshToken: setRefreshToken };
});
exports.userLoginService = userLoginService;
const userSetPasswordService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, userId, tokenRequest }) {
    if (!password)
        throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
    const findUserById = yield db_1.default.user.findFirst({
        where: {
            AND: [
                { id: userId },
                { isUpdatePassword: false },
            ]
        }
    });
    if ((findUserById === null || findUserById === void 0 ? void 0 : findUserById.tokenUpdatePassword) !== tokenRequest)
        throw { msg: 'Link sudah tidak berlaku, silahkan kirim ulang permintaan', status: 400 };
    if (!findUserById)
        throw { msg: 'Permintaan ubah password sudah digunakan. Silakan kirim ulang permintaan untuk mengganti password lagi.' };
    const response = yield db_1.default.user.update({
        where: { id: userId },
        data: {
            password: yield (0, hashPassword_1.hashPassword)(password),
            tokenUpdatePassword: null,
            isUpdatePassword: true
        }
    });
    return { response };
});
exports.userSetPasswordService = userSetPasswordService;
const userForgotPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email)
        throw { msg: 'Email wajib diisi', status: 400 };
    if (!(0, checkInput_1.checkEmail)(email))
        throw { msg: 'Format email tidak sesuai', status: 400 };
    const findUserByEmail = yield db_1.default.user.findFirst({
        where: { email }
    });
    if (!findUserByEmail)
        throw { msg: 'User tidak tersedia', status: 404 };
    const setToken = (0, tokenJwt_1.tokenSign)({ id: findUserByEmail.id, role: findUserByEmail.role });
    yield db_1.default.user.update({
        where: { id: findUserByEmail.id },
        data: {
            isUpdatePassword: false,
            tokenUpdatePassword: setToken
        }
    });
    const readFileHtml = (0, fs_1.readFileSync)('./src/public/emailHtml/forgotPassword.html', 'utf-8');
    let compiledHtml = (0, handlebars_1.compile)(readFileHtml);
    compiledHtml = compiledHtml({
        url: `http://localhost:3000/set-password-user/${setToken}`,
        nama: findUserByEmail.firstName
    });
    yield transporter_1.transport.sendMail({
        to: email,
        html: compiledHtml
    });
});
exports.userForgotPasswordService = userForgotPasswordService;
