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
exports.deleteProductInformation = exports.updateProductInformation = exports.updateProductActive = exports.getAllDataProductAdmin = exports.createProduct = void 0;
const db_1 = __importDefault(require("../connection/db"));
const imageKit_1 = require("../utils/imageKit");
const fs_1 = require("fs");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imagesUploaded = (req.files || {});
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, description, price, isActive, stock, weightGram, categoryId, } = req.body;
        if (!name || !description || !price || !stock || !weightGram || !categoryId)
            throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
        if (!imagesUploaded.images || imagesUploaded.images.length === 0)
            throw { msg: 'File tidak ditemukan', status: 404 };
        const fileBuffer = (0, fs_1.readFileSync)(imagesUploaded.images[0].path);
        if (!!fileBuffer) {
            const fileUploadImageKit = yield imageKit_1.imageKit.upload({
                file: fileBuffer,
                fileName: imagesUploaded.images[0].filename,
                folder: "/products/body-sparepart"
            });
            if (!fileUploadImageKit)
                throw { msg: 'Gagal upload data', status: 400 };
            const uploadedProduct = yield db_1.default.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    imageUrl: fileUploadImageKit.url,
                    isActive: isActive === 'false' ? false : true,
                    stock: Number(stock),
                    weightGram: Number(weightGram),
                    ownerId: Number(userId),
                    categoryId: Number(categoryId)
                }
            });
            if (!uploadedProduct)
                throw { msg: 'Gagal membuat produk', status: 400 };
            (0, fs_1.rmSync)(imagesUploaded.images[0].path);
        }
        res.status(200).json({
            data: {},
            error: false,
            message: 'Berhasil mengupload produk!'
        });
    }
    catch (error) {
        (0, fs_1.rmSync)(imagesUploaded.images[0].path);
        next(error);
    }
});
exports.createProduct = createProduct;
const getAllDataProductAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = '', limit = '5', page = '1' } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;
        let whereClause = {
            deletedAt: null
        };
        if (search) {
            whereClause = {
                OR: [
                    { name: { contains: search } },
                ]
            };
        }
        const findAllProduct = yield db_1.default.product.findMany({
            where: whereClause, take, skip,
            orderBy: { createdAt: 'desc' }
        });
        const totalCount = yield db_1.default.product.count({
            where: whereClause
        });
        const totalPage = Math.ceil(totalCount / Number(limit));
        res.status(200).json({
            error: false,
            data: { data: findAllProduct, totalPage },
            message: 'Berhasil mendapatkan data'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllDataProductAdmin = getAllDataProductAdmin;
const updateProductActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isActive } = req.body;
        const { idProduct } = req.params;
        const findProduct = yield db_1.default.product.findFirst({
            where: { id: Number(idProduct) }
        });
        if (!findProduct || findProduct.deletedAt !== null)
            throw { msg: 'Produk sudah tidak tersedia', status: 404 };
        yield db_1.default.product.update({
            where: {
                id: Number(idProduct)
            }, data: {
                isActive: isActive === 'false' ? false : true
            }
        });
        res.status(200).json({
            error: false,
            data: {},
            message: isActive === 'true' ?
                'Produkmu sekarang aktif'
                : 'Produkmu sudah di non-aktif'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductActive = updateProductActive;
const updateProductInformation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imagesUploaded = (req.files || {});
    try {
        const { name, description, price, stock, weightGram, isActive } = req.body;
        const { idProduct } = req.params;
        const findProduct = yield db_1.default.product.findFirst({
            where: {
                AND: [
                    { id: Number(idProduct) },
                    { deletedAt: null }
                ]
            }
        });
        if (!findProduct || findProduct.deletedAt !== null)
            throw { msg: 'Produk sudah tidak tersedia', status: 404 };
        if (!name || !description || !price || !stock || !weightGram)
            throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
        if (!imagesUploaded.images || imagesUploaded.images.length === 0) {
            yield db_1.default.product.update({
                where: { id: Number(idProduct) },
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    isActive: isActive === 'false' ? false : true,
                    stock: Number(stock),
                    weightGram: Number(weightGram),
                    imageUrl: findProduct.imageUrl
                }
            });
            res.status(200).json({
                error: false,
                data: {},
                message: 'Berhasil mengupdate data'
            });
            return;
        }
        const fileNameOnDb = (_a = findProduct.imageUrl) === null || _a === void 0 ? void 0 : _a.split('/').pop();
        const findFileName = yield imageKit_1.imageKit.listFiles({
            searchQuery: `name = "${fileNameOnDb}"`,
            limit: 1
        });
        if (findFileName.length === 0)
            throw { msg: 'Nama File tidak tersedia', status: 404 };
        const file = findFileName[0];
        const fileBuffer = (0, fs_1.readFileSync)(imagesUploaded.images[0].path);
        if (!fileBuffer)
            throw { msg: 'Ada kesalahan saat membaca file', status: 404 };
        const fileUploadImageKit = yield imageKit_1.imageKit.upload({
            file: fileBuffer,
            fileName: imagesUploaded.images[0].filename,
            folder: "/products/body-sparepart"
        });
        if (!fileUploadImageKit)
            throw { msg: 'Gagal upload gambar', status: 400 };
        const uploadedProduct = yield db_1.default.product.update({
            where: { id: Number(idProduct) },
            data: {
                name,
                description,
                price: parseFloat(price),
                isActive: isActive === 'false' ? false : true,
                stock: Number(stock),
                weightGram: Number(weightGram),
                imageUrl: fileUploadImageKit.url
            }
        });
        if (!uploadedProduct)
            throw { msg: 'Ada kesalahan saat mengupdate data', status: 400 };
        (0, fs_1.rmSync)(imagesUploaded.images[0].path);
        if ("fileId" in file)
            yield imageKit_1.imageKit.deleteFile(file.fileId);
        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil mengupdate data'
        });
    }
    catch (error) {
        (0, fs_1.rmSync)(imagesUploaded.images[0].path);
        next(error);
    }
});
exports.updateProductInformation = updateProductInformation;
const deleteProductInformation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProduct } = req.params;
        const findProduct = yield db_1.default.product.findFirst({
            where: {
                AND: [
                    { id: Number(idProduct) },
                    { deletedAt: null }
                ]
            }
        });
        if (!findProduct)
            throw { msg: 'Produk sudah tidak tersedia', status: 404 };
        const updatedProduct = yield db_1.default.product.update({
            where: {
                id: Number(idProduct)
            },
            data: {
                isActive: false,
                deletedAt: new Date()
            }
        });
        if (!updatedProduct)
            throw { msg: 'Gagal menghapus produk', status: 400 };
        res.status(200).json({
            error: false,
            data: {},
            message: 'Berhasil menghapus data'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProductInformation = deleteProductInformation;
