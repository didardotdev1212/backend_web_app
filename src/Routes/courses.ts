import { Router } from "express";
// import AuthUser from "../Middleware/AuthUser";
import { GetCourseByID, EnrollInCourse } from "../Controllers/courses";
import AuthUser_Optional from "../Middleware/AuthUser_Optional";
import AuthUser from "../Middleware/AuthUser";
const router = Router();

router.get("/:id", AuthUser_Optional, GetCourseByID);
router.post("/enroll/:courseId", AuthUser, EnrollInCourse);

export default router;
