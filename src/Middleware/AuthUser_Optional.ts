import jose from "jose";
import { Response, NextFunction } from "express";
import db from "../lib/knex";

const AuthUser_Optional = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authheader = req.headers.authorization;
  const token = authheader?.split(" ")[1];
  try {
    if (token) {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      const user = await db("users").where({ id: payload.id }).first();
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      req.user = { id: user.id };
      next();
    } else {
      req.user = null;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default AuthUser_Optional;
