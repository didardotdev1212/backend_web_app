import { Router } from "express";
//// middlewares
import upload from "../../Middleware/Upload";
import AdminAuth from "../../Middleware//Admin/AdminAuth";
//// controllers
import {
  CreateCourse,
  GetCourses,
  DeleteCourse,
} from "../../Controllers/Admin/courses";

const router = Router();

router.get("/", AdminAuth, GetCourses);
router.post("/create", AdminAuth, upload.single("image"), CreateCourse);
router.delete("/delete/:courseId", AdminAuth, DeleteCourse);

export default router;
