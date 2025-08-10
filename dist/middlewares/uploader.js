"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = require("../utils/multer");
const uploader = (req, res, next) => {
    var _a, _b;
    const uploaded = multer_1.uploadMulter.fields([{ name: 'images', maxCount: 1 }]);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    uploaded(req, res, function (err) {
        try {
            if (err)
                throw { msg: 'Ada kesalahan saat mengupload file', status: 400 };
            if (userId && userRole) {
                const dataUser = req.user;
                req.user = Object.assign(Object.assign({}, dataUser), { id: userId, role: userRole });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.uploader = uploader;
