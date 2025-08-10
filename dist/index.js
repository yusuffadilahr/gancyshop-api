"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const asciitext_1 = require("./utils/asciitext");
const db_1 = __importStar(require("./connection/db"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const tokenJwt_1 = require("./utils/tokenJwt");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        credentials: true,
        origin: '*'
    }
});
io.on('connection', (socket) => {
    socket.on('chat', (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ token, message, role }, cb) {
        const dataUser = (0, tokenJwt_1.tokenVerify)(token);
        if (!message || message.trim() === '') {
            socket.emit('error', { message: 'Pesan tidak boleh kosong.' });
            cb({ error: true, message: 'Pesan tidak boleh kosong.' });
            return;
        }
        try {
            const created = yield db_1.default.messagecustomer.create({
                data: {
                    message,
                    userId: dataUser === null || dataUser === void 0 ? void 0 : dataUser.id,
                    role: role || 'USER',
                }
            });
            socket.emit('chat:incoming', created);
            cb({ error: false, status: 201, message: 'Berhasil' });
        }
        catch (err) {
            cb({ error: true, message: 'Gagal menyimpan pesan.' });
            socket.emit('error', { message: 'Gagal menyimpan pesan.' });
        }
    }));
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const corsOption = {
    origin: '*', // devel
    credentials: true
};
app.use((0, cors_1.default)(corsOption));
app.use('/', (req, res, next) => {
    res.send('<h1>Welcoming bray</h1>');
});
app.use('/api', routes_1.default);
app.use((error, req, res, next) => {
    logger_1.logger.error(`ERROR ${error.status || 500} ${error.msg} - URL: ${req.method} ${req.url} ERROR_SERVER: ${(error === null || error === void 0 ? void 0 : error.message) || ''}`);
    res.status(error.status || 500).json({
        error: true,
        message: error.msg || 'Something went wrong!',
        data: {}
    });
});
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
(0, db_1.dbConnect)();
if (port) {
    server.listen(port, () => {
        console.log(asciitext_1.asciitext);
        console.log(`Server running on port ${port}`);
    });
}
else {
    module.exports = app;
}
