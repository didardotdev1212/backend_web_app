import { register } from "../Controllers/Auth";
import { Router } from "express";
const router = Router();
router.post("/register", register);
export default router;
