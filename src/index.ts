import express, {
    Express, Request,
    Response, NextFunction
} from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import { asciitext } from "./utils/asciitext";
import { dbConnect } from "./connection/db";
import router from "./routes";

dotenv.config()
const port = process.env.PORT

const app: Express = express()
app.use(express.json())


const corsOption = {
    origin: '*',
    credentials: true
}

app.use(cors(corsOption))

app.use('/welcome-in-web-by-serverside', (req: Request, res: Response, next: NextFunction) => {
    res.send('<h1>Welcoming bray</h1>')
})

interface IError extends Error {
    msg: string,
    status: number
}

app.use('/api', router)
app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
        error: true,
        message: error.msg || 'Something went wrong!',
        data: {}
    })
})

dbConnect()

app.listen(port, () => {
    console.log(asciitext)
})