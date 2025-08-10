"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = exports.checkNumberInput = exports.checkCharacter = void 0;
const checkCharacter = (val) => {
    const schemaInput = /^[A-Za-z]+$/;
    return schemaInput.test(val);
};
exports.checkCharacter = checkCharacter;
const checkNumberInput = (val) => {
    const schema = /^[0-9]+$/;
    return schema.test(val);
};
exports.checkNumberInput = checkNumberInput;
const checkEmail = (val) => {
    const schema = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return schema.test(val);
};
exports.checkEmail = checkEmail;
