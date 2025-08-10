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
exports.createCategory = exports.getCategoryProduct = exports.getCategoryProductById = exports.getCategoryMotorCycle = void 0;
const db_1 = __importDefault(require("../connection/db"));
const getCategoryMotorCycle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findAllCategory = yield db_1.default.categorymotorcyle.findMany();
        if (findAllCategory.length === 0)
            throw { msg: 'Data tidak tersedia', status: 404 };
        res.status(200).json({
            error: false,
            data: findAllCategory,
            message: 'Berhasil menampilkan data kategori motor'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryMotorCycle = getCategoryMotorCycle;
const getCategoryProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryMotorId } = req.params;
        const findAllCategoryByCategoryMotor = yield db_1.default.category.findMany({
            where: {
                categoryMotorcycleId: Number(categoryMotorId)
            }
        });
        if (findAllCategoryByCategoryMotor.length === 0)
            throw { msg: 'Gagal mendapatkan data kategori', status: 404 };
        res.status(200).json({
            error: false,
            data: findAllCategoryByCategoryMotor,
            message: 'Berhasil mendapatkan data kategori'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryProductById = getCategoryProductById;
const getCategoryProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '5', search = '' } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;
        let whereClause = {
            deletedAt: null
        };
        if (!!search) {
            whereClause = Object.assign(Object.assign({}, whereClause), { categoryName: { contains: search }, categorymotorcyle: {
                    motorCycleName: { contains: search }
                } });
        }
        const findAllCategory = yield db_1.default.category.findMany({
            include: {
                categorymotorcyle: true
            },
            where: whereClause, take, skip,
            orderBy: { createdAt: 'desc' }
        });
        if (findAllCategory.length === 0)
            throw { msg: 'Data kategori kosong', status: 404 };
        res.status(200).json({
            error: false,
            data: findAllCategory,
            message: 'Berhasil mendapatkan data kategori'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryProduct = getCategoryProduct;
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCategoryMotor, dataMotorOptional, releaseYearOptional, categoryName } = req.body;
        if (!categoryName)
            throw { msg: 'Harap diisi terlebih dahulu', status: 400 };
        if (!!dataMotorOptional && !!releaseYearOptional) {
            yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const dataCategoryMotor = yield tx.categorymotorcyle.create({
                    data: {
                        motorCycleName: dataMotorOptional,
                        releaseYear: Number(releaseYearOptional),
                    }
                });
                if (!dataCategoryMotor)
                    throw { msg: 'Gagal melakukan proses pembuatan nama kategori motor', status: 400 };
                yield tx.category.create({
                    data: {
                        categoryName,
                        categoryMotorcycleId: dataCategoryMotor.id
                    }
                });
            }));
            res.status(201).json({
                error: false,
                data: {},
                message: 'Berhasil membuat data kategori baru'
            });
            return;
        }
        const createDataCategory = yield db_1.default.category.create({
            data: {
                categoryName,
                categoryMotorcycleId: Number(idCategoryMotor),
            }
        });
        if (!createDataCategory)
            throw { msg: 'Gagal membuat data kategori', status: 400 };
        res.status(201).json({
            error: false,
            data: {},
            message: 'Berhasil membuat data kategori baru'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCategory = createCategory;
