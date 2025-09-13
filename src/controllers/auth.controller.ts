import { NextFunction, Request, Response } from "express";
import { tokenSign } from "../utils/tokenJwt";
import { config } from "dotenv";

config();
const isProduction = process.env.NODE_ENV === "production";
export const authRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataUser = req.user;
    if (!dataUser?.id || !dataUser?.role)
      throw { msg: "Data user tidak tersedia", status: 404 };

    if (dataUser?.type !== "refresh")
      throw { msg: "Akses ditolak: refresh token diperlukan.", status: 400 };
    const newAccessToken = tokenSign({
      id: dataUser?.id as number,
      role: dataUser?.role as "USER" | "ADMIN",
      expires: "1h",
    });

    res.status(200).json({
      error: false,
      message: "Berhasil merefresh token anda",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const authLogoutClearCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataUser = req.user;
    if (!dataUser?.id || !dataUser?.role)
      throw { msg: "Data user tidak tersedia", status: 404 };
    if (dataUser?.type !== "refresh")
      throw { msg: "Akses ditolak: refresh token diperlukan.", status: 400 };

    res.clearCookie("_refreshToken", {
      httpOnly: true,
      secure: isProduction ? true : false, // prod wajib true
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax", // agar bisa lintas domain pakai none
      path: "/",
      domain: isProduction ? ".gancy.my.id" : undefined,
      //domain tambah domain untuk membuat cookie lintas domain
    });

    res.status(200).json({
      error: false,
      message: "Berhasil logout",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
