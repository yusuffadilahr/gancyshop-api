"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAiHandler = void 0;
const dotenv_1 = require("dotenv");
const openai_1 = __importDefault(require("openai"));
(0, dotenv_1.config)();
const apiKeyOpenAi = process.env.OPEN_AI_SECRET_KEYS || '';
if (!apiKeyOpenAi)
    throw new Error("OpenAI API Key is missing. Please check your .env file.");
exports.openAiHandler = new openai_1.default({
    apiKey: apiKeyOpenAi
});
