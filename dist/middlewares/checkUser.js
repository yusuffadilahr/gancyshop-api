"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoleUser = void 0;
const tokenJwt_1 = require("../utils/tokenJwt");
const checkRoleUser = (req, res, next) => {
    var _a;
    try {
        const { authorization } = req.headers;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const tokenUser = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const dataUser = (0, tokenJwt_1.tokenVerify)(tokenUser);
        if (role !== 'ADMIN')
            throw { msg: 'Anda tidak dapat mengakses, anda bukan admin', status: 400 };
        if (dataUser && dataUser.id)
            req.user = dataUser;
        next();
    }
    catch (error) {
        console.log(error, '<<');
        next(error);
    }
};
exports.checkRoleUser = checkRoleUser;
