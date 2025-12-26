import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const isProduction = process.env.NODE_ENV === "production";
const dbUrl = isProduction
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL_LOCAL;

const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl },
  },
});
export const dbConnect = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("db connect");
  } catch (error) {
    console.log(error, "Database tidak terhubung");
  }
};

export default prisma;
