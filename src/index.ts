import express, {
    Express, Request,
    Response, NextFunction
} from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import { asciitext } from "./utils/asciitext";
import prisma, { dbConnect } from "./connection/db";
import router from "./routes";
import { ITokenVerify } from "./types";
import path from "path";
import http from 'http'
import { Server as SocketIO } from "socket.io";
import { tokenVerify } from "./utils/tokenJwt";
import { logger } from "./utils/logger";

dotenv.config()
const port = process.env.PORT

const app: Express = express()
app.use(express.json())

const server = http.createServer(app)
const io = new SocketIO(server, {
    cors: {
        credentials: true,
        origin: '*'
    }
})

io.on('connection', (socket) => {
    socket.on('chat', async ({ token, message, role }, cb) => {
        const dataUser = tokenVerify(token) as ITokenVerify

        if (!message || message.trim() === '') {
            socket.emit('error', { message: 'Pesan tidak boleh kosong.' })
            cb({ error: true, message: 'Pesan tidak boleh kosong.' })

            return
        }

        try {
            const created = await prisma.messagecustomer.create({
                data: {
                    message,
                    userId: dataUser?.id,
                    role: role || 'USER',
                }
            })

            socket.emit('chat:incoming', created)
            cb({ error: false, status: 201, message: 'Berhasil' })
        } catch (err) {
            cb({ error: true, message: 'Gagal menyimpan pesan.' })
            socket.emit('error', { message: 'Gagal menyimpan pesan.' })
        }
    })


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})

declare global {
    namespace Express {
        interface Request {
            user?: ITokenVerify
        }
    }
}

const corsOption = {
    origin: '*', // devel
    credentials: true
}

app.use(cors(corsOption))

interface IError extends Error {
    msg: string,
    status: number
}

app.use('/api', router)
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('<h1>Welcoming bray</h1>')
})

app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    logger.error(`ERROR ${error.status || 500} ${error.msg} - URL: ${req.method} ${req.url} ERROR_SERVER: ${error?.message || ''}`);
    res.status(error.status || 500).json({
        error: true,
        message: error.msg || 'Something went wrong!',
        data: {}
    })
})

app.use('/public', express.static(path.join(__dirname, 'public')));
dbConnect()

if (port) {
    server.listen(port, () => {
        console.log(asciitext);
        console.log(`Server running on port ${port}`);
    });
} else {
    module.exports = app;
}