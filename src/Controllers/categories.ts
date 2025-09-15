import { Request, Response } from "express";
import db from "../lib/knex";

const GetCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db("categories").select("id", "name");
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetCategories };
