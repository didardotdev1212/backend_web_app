import { Request, Response } from "express";
import db from "../lib/knex";
import bcrypt from "bcryptjs";
import jose from "jose";
const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  try {
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailregex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordregex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number",
      });
    }
    const userexist = await db("users").where({ email }).first();
    if (userexist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").insert({
      email,
      password: hashedPassword,
      role: "STUDENT",
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    //1. check if user exists
    const user = await db("users")
      .select("id", "email", "password")
      .where({ email })
      .first();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //2. check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //3. create a token
    const token = await new jose.SignJWT({ email: user.email, id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const profile = async (req: any, res: Response) => {
  const iserid = req.user.id;
  const user = await db("users")
    .select("id", "email", "role")
    .where({ id: iserid })
    .first();

  return res.json({ success: true, message: "User profile", data: user });
};
const UploadAvatar = async (req: any, res: Response) => {
  /// save path to database
  const userId = req.user.id;
  const profile = await db("users").where({ id: userId }).first();
  /// save file path to database
  const file = req.file;
  const fileUrl = `https://pub-8b2d28096f434a889120e98b6606a84e.r2.dev/${file.key}`;

  await db("users").where({ id: userId }).update({ avatar: fileUrl });

  return res.json({
    success: true,
    message: `${profile.email} avatar uploaded successfully`,
    data: req.file,
  });
};
export { register, login, profile, UploadAvatar };
