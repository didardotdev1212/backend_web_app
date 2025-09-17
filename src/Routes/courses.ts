import { Router } from "express";
//// middlewares
import upload from "../Middleware/Upload";
import AuthUser from "../Middleware/AuthUser";
//// controllers
import { CreateCourse } from "../Controllers/courses";

const router = Router();

router.post("/create", AuthUser, upload.single("image"), CreateCourse);

export default router;
