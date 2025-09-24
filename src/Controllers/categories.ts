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

const GetCategoriesWithCourses = async (req: Request, res: Response) => {
  try {
    const categories = await db("categories").select("id", "name");
    if (categories.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No categories found" });
    }
    await Promise.all(
      categories.map(async (category: any) => {
        const courses = await db("courses")
          .where("courses.category_id", category.id)
          .leftJoin("users", "courses.created_by", "users.id")
          .select(
            "courses.*",
            "users.FirstName as FirstName",
            "users.LastName as LastName"
          )
          .limit(5)
          .orderBy("courses.id", "desc");
        (category as any).courses = courses;
      })
    );
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetCategories, GetCategoriesWithCourses };
