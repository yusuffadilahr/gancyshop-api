import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail()
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .isLength({ max: 50 })
    .withMessage("Password maksimal 50 karakter")
    .escape(),
];

export const registerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Nama depan wajib diisi")
    .isString()
    .withMessage("Nama depan harus berupa teks")
    .isLength({ min: 2 })
    .withMessage("Nama depan minimal 2 karakter")
    .isLength({ max: 50 })
    .withMessage("Nama depan maksimal 50 karakter")
    .escape(),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Nama belakang wajib diisi")
    .isString()
    .withMessage("Nama belakang harus berupa teks")
    .isLength({ min: 2 })
    .withMessage("Nama belakang minimal 2 karakter")
    .isLength({ max: 50 })
    .withMessage("Nama belakang maksimal 50 karakter")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail()
    .escape(),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Nomor telepon wajib diisi")
    .isNumeric()
    .withMessage("Nomor telepon hanya boleh berisi angka")
    .isLength({ min: 10 })
    .withMessage("Nomor telepon minimal 10 digit")
    .isLength({ max: 16 })
    .withMessage("Nomor telepon maksimal 16 digit")
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .isLength({ max: 50 })
    .withMessage("Password maksimal 50 karakter")
    .escape(),
];

export const adminCreateUserValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Nama depan wajib diisi")
    .isString()
    .withMessage("Nama depan harus berupa teks")
    .isLength({ min: 2 })
    .withMessage("Nama depan minimal 2 karakter")
    .isLength({ max: 50 })
    .withMessage("Nama depan maksimal 50 karakter")
    .escape(),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Nama belakang wajib diisi")
    .isString()
    .withMessage("Nama belakang harus berupa teks")
    .isLength({ min: 2 })
    .withMessage("Nama belakang minimal 2 karakter")
    .isLength({ max: 50 })
    .withMessage("Nama belakang maksimal 50 karakter")
    .escape(),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("ROLE wajib diisi")
    .isIn(["ADMIN", "USER"])
    .withMessage("Role salah/tidak ada.")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail()
    .escape(),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Nomor telepon wajib diisi")
    .isNumeric()
    .withMessage("Nomor telepon hanya boleh berisi angka")
    .isLength({ min: 10 })
    .withMessage("Nomor telepon minimal 10 digit")
    .isLength({ max: 16 })
    .withMessage("Nomor telepon maksimal 16 digit")
    .escape(),
];

export const addToCartValidation = [
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("ID Produk diperlukan")
    .escape(),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Masukkan harga terlebih dahulu")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Harga tidak valid!")
    .escape(),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Masukkan harga terlebih dahulu")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Quantity tidak valid!")
    .escape(),
];

// formdata
export const createProductValidation = [
  body("name").escape(),
  body("description").escape(),
  body("price").escape(),
  body("isActive").escape(),
  body("stock").escape(),
  body("weightGram").escape(),
  body("categoryId").escape(),
];
