import { Response } from "express";
import db from "../lib/knex";

const GetCourseByID = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    let course = await db("courses")
      .select("courses.*", "categories.name as category_name")
      .where("courses.id", id)
      .leftJoin("categories", "courses.category_id", "categories.id")
      .first();
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (req?.user) {
      const isEnrolled = await db("EnrolledCourses")
        .where({ user_id: req.user.id, course_id: id })
        .first();
      course = { ...course, isEnrolled: !!isEnrolled };
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const EnrollInCourse = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const course = await db("courses").where({ id: courseId }).first();
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const existingEnrollment = await db("EnrolledCourses")
      .where({ user_id: userId, course_id: courseId })
      .first();
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });
    }
    await db("EnrolledCourses").insert({
      user_id: userId,
      course_id: courseId,
      created_at: new Date(),
    });
    return res
      .status(200)
      .json({ success: true, message: "Enrolled in course successfully" });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { GetCourseByID, EnrollInCourse };
