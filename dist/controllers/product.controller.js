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
exports.getProductByIdPublic = exports.getCategoryForFilterProductPublic = exports.getAllProductPublic = void 0;
const db_1 = __importDefault(require("../connection/db"));
const date_fns_1 = require("date-fns");
const getAllProductPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = '5', page = '1', search, category, minPrice, maxPrice, minWeight, maxWeight, statusProduct, stock, tanggalDibuat } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;
        let whereClause = {
            AND: [
                { deletedAt: null },
                { isActive: true },
            ]
        };
        const stockValidation = stock === 'stok-habis' ? { equals: 0 } :
            stock === 'hampir-habis' ? { gte: 1, lte: 9 } :
                stock === 'tersedia' ? { gte: 10 } :
                    undefined;
        if (search || category || tanggalDibuat || minPrice || maxPrice ||
            minWeight || maxWeight || stock) {
            whereClause = Object.assign(Object.assign({}, whereClause), { AND: [
                    ...(search ? [{ name: { contains: search } }] : []),
                    ...(category ? [{ categoryId: Number(category) }] : []),
                    ...(tanggalDibuat ? [{
                            createdAt: {
                                gte: new Date(tanggalDibuat),
                                lte: (0, date_fns_1.addDays)(new Date(tanggalDibuat), 1)
                            }
                        }] : []),
                    ...(minPrice && maxPrice ? [{
                            price: {
                                gte: Number(minPrice),
                                lte: Number(maxPrice)
                            }
                        }] : []),
                    ...(minWeight && maxWeight ? [{
                            weightGram: {
                                gte: Number(minWeight),
                                lte: Number(maxWeight)
                            }
                        }] : []),
                    ...(stock ? [{ stock: stockValidation }] : [])
                ] });
        }
        const findAllProduct = yield db_1.default.product.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        });
        const totalCount = yield db_1.default.product.count({ where: whereClause });
        const totalPage = Math.ceil(totalCount / Number(limit));
        if (findAllProduct.length === 0)
            throw { msg: 'Data tidak tersedia/kosong', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil menampilkan data',
            data: {
                totalPage,
                data: findAllProduct
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductPublic = getAllProductPublic;
const getCategoryForFilterProductPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findAllCategory = yield db_1.default.category.findMany();
        if (findAllCategory.length === 0)
            throw { msg: 'Data kategori tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan kategori',
            data: findAllCategory
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryForFilterProductPublic = getCategoryForFilterProductPublic;
const getProductByIdPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProduct } = req.params;
        if (!idProduct)
            throw { msg: 'Ada kesalahan dari sisi server', status: 500 };
        const findProductById = yield db_1.default.product.findFirst({
            where: {
                id: Number(idProduct)
            }
        });
        if (!findProductById)
            throw { msg: 'Data produk tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            data: findProductById,
            message: 'Berhasil mendapatkan data produk'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductByIdPublic = getProductByIdPublic;
