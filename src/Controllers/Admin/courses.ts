import { Response } from "express";
import db from "../../lib/knex";

const GetCourses = async (req: any, res: Response) => {
  try {
    const courses = await db("courses")
      .select("*")
      .where({ created_by: req.user.id });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CreateCourse = async (req: any, res: Response) => {
  try {
    let { title, description, category_id, price, lessons } = req.body;
    console.log(req.file);
    const user_id = req.user.id;
    const imageurl = req.file
      ? `https://pub-8b2d28096f434a889120e98b6606a84e.r2.dev/${req?.file?.key}`
      : "";
    const [insertedId] = await db("courses")
      .insert({
        title: title,
        description: description,
        category_id: category_id,
        image: imageurl,
        price: price,
        created_by: user_id,
        created_at: new Date(),
      })
      .returning("id"); // Specify the name of your ID column

    try {
      lessons = JSON.parse(lessons);
    } catch (error) {
      lessons = [];
    }

    if (lessons && lessons.length > 0) {
      const lessonsToInsert = lessons?.map((lesson: any, index: number) => ({
        course_id: insertedId?.id || insertedId, // Adjust based on your DB returning behavior
        name: lesson.name,
        video_url: lesson.video_url,
        order: index + 1,
      }));
      await db("lessons").insert(lessonsToInsert);
    }

    res
      .status(201)
      .json({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteCourse = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const user_id = req.user.id;
    const isExists = await db("courses")
      .select("*")
      .where({ id: courseId })
      .first();
    if (!isExists) {
      return res.status(404).json({ message: "Course not found" });
    }
    /// is created by the same user
    if (isExists.created_by !== user_id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }
    await db("courses").where({ id: courseId }).del();
    /// delete lessons
    await db("lessons").where({ course_id: courseId }).del();
    //// delete enrollments
    await db("EnrolledCourses").where({ course_id: courseId }).del();

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { CreateCourse, GetCourses, DeleteCourse };
