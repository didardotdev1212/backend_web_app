import { Router } from "express";
// import AuthUser from "../Middleware/AuthUser";
import { GetCourseByID } from "../Controllers/courses";

const router = Router();

router.get("/:id", GetCourseByID);

export default router;
