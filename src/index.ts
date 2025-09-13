import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { asciitext } from "./utils/asciitext";
import prisma, { dbConnect } from "./connection/db";
import router from "./routes";
import { IError, ITokenVerify } from "./types";
import path from "path";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { tokenVerify } from "./utils/tokenJwt";
import { logger } from "./utils/logger";
import { testConnection } from "./connection/c";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT;
const isProduction = process.env.NODE_ENV === "production";
const webDomain = isProduction ? process.env.WEB_URL : "http://localhost:3000";

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    credentials: true,
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("chat", async ({ token, message, role }, cb) => {
    const dataUser = tokenVerify(token) as ITokenVerify;

    if (!message || message.trim() === "") {
      socket.emit("error", { message: "Pesan tidak boleh kosong." });
      cb({ error: true, message: "Pesan tidak boleh kosong." });

      return;
    }

    try {
      const created = await prisma.messagecustomer.create({
        data: {
          message,
          userId: dataUser?.id,
          role: role || "USER",
        },
      });

      socket.emit("chat:incoming", created);
      cb({ error: false, status: 201, message: "Berhasil" });
    } catch (err) {
      cb({ error: true, message: "Gagal menyimpan pesan." });
      socket.emit("error", { message: "Gagal menyimpan pesan." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

declare global {
  namespace Express {
    interface Request {
      user?: ITokenVerify;
    }
  }
}

const corsOption = {
  origin: [`${webDomain}`, "http://localhost:3000"],
  method: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOption));
app.use("/api", router);

app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
  logger.error(
    `ERROR ${error.status || 500} ${error.msg} - URL: ${req.method} ${
      req.url
    } ERROR_SERVER: ${error?.message || ""}`
  );

  res.status(error.status).json({
    error: true,
    message: error.msg || "Something went wrong!",
    data: {},
    statusCode: error.status || 500,
  });
});

app.use("/public", express.static(path.join(__dirname, "public")));
dbConnect();
testConnection();

if (port) {
  server.listen(port, () => {
    console.log(asciitext);
    console.log(`Server running on port ${port}`);
  });
} else {
  module.exports = app;
}
