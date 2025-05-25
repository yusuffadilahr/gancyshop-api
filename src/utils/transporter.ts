import { config } from "dotenv";
import { createTransport } from "nodemailer";

config()
export const transport = createTransport({
    service: process.env.TRANSPORTER_SERVICE,
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})