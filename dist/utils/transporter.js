"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const dotenv_1 = require("dotenv");
const nodemailer_1 = require("nodemailer");
(0, dotenv_1.config)();
exports.transport = (0, nodemailer_1.createTransport)({
    service: process.env.TRANSPORTER_SERVICE,
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
