import { Router } from "express";
//// middlewares
import upload from "../../Middleware/Upload";
import AdminAuth from "../../Middleware//Admin/AdminAuth";
//// controllers
import { CreateCourse } from "../../Controllers/Admin/courses";

const router = Router();

router.post("/create", AdminAuth, upload.single("image"), CreateCourse);

export default router;
