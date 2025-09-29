import { Response } from "express";
import db from "../lib/knex";

const GetCourseByID = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const courses = await db("courses").select("*").where({ id: id }).first();
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { GetCourseByID };
