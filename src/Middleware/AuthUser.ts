import jose from "jose";
import { Response, NextFunction } from "express";
import db from "../lib/knex";

const AuthUser = async (req: any, res: Response, next: NextFunction) => {
  const authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = authheader.split(" ")[1];
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log(payload);

    const user = await db("users").where({ id: payload.id }).first();
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default AuthUser;
