"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageKit = void 0;
const dotenv_1 = require("dotenv");
const imagekit_1 = __importDefault(require("imagekit"));
(0, dotenv_1.config)();
const PublicKey = process.env.IMAGES_KIT_IO_PUBLIC_KEY || '';
const PrivateKey = process.env.IMAGES_KIT_IO_PRIVATE_KEY || '';
const UrlEndpoint = process.env.IMAGES_KIT_IO_URL_ENDPOINT || '';
exports.imageKit = new imagekit_1.default({
    publicKey: PublicKey,
    privateKey: PrivateKey,
    urlEndpoint: UrlEndpoint
});
