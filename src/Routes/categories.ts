import { Router } from "express";
import {
  GetCategories,
  GetCategoriesWithCourses,
} from "../Controllers/categories";

const router = Router();

router.get("/", GetCategories);
router.get("/recent-courses", GetCategoriesWithCourses);

export default router;
