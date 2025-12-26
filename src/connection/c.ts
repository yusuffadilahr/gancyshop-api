import { config } from "dotenv";
import mysql from "mysql2/promise";

config();
const isProduction = process.env.NODE_ENV === "production";
export async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: isProduction ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
      user: isProduction ? process.env.DB_USER : process.env.DB_USER_LOCAL,
      password: isProduction ? process.env.DB_PASS : process.env.DB_PASS_LOCAL,
      database: isProduction ? process.env.DB_NAME : process.env.DB_NAME_LOCAL,
      port: 3306,
    });

    console.log("Connected to DB!");
    await connection.end();
  } catch (error) {
    console.error("Connection error:", error);
  }
}

export const pool = mysql.createPool({
  host: isProduction ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
  user: isProduction ? process.env.DB_USER : process.env.DB_USER_LOCAL,
  password: isProduction ? process.env.DB_PASS : process.env.DB_PASS_LOCAL,
  database: isProduction ? process.env.DB_NAME : process.env.DB_NAME_LOCAL,
});
