"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMulter = exports.multerStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../public/images');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const splitOriginalName = file.originalname.split('.');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + splitOriginalName[splitOriginalName.length - 1]);
    }
});
const fileFilter = (req, file, cb) => {
    const extensionAccepted = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
    const splitOriginalName = file.originalname.split('.');
    if (!extensionAccepted.includes(splitOriginalName[splitOriginalName.length - 1])) {
        return cb(new Error('Format File Tidak Diizinkan'));
    }
    return cb(null, true);
};
exports.uploadMulter = (0, multer_1.default)({
    storage: exports.multerStorage,
    fileFilter: fileFilter, limits: { fileSize: 2 * 1024 * 1024 }
});
