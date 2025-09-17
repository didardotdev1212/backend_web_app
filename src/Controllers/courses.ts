import { Response } from "express";
import db from "../lib/knex";

const CreateCourse = async (req: any, res: Response) => {
  try {
    const { title, description, category_id, price } = req.body;
    const image_url = req.file ? req.file.path : "";
    const user_id = req.user.id;
    await db("courses").insert({
      title: title,
      description: description,
      category_id: category_id,
      image: image_url,
      price: price,
      created_by: user_id,
      created_at: new Date(),
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { CreateCourse };
