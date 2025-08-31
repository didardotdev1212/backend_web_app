import { register, login, profile } from "../Controllers/Auth";
import { Router } from "express";
import AuthUser from "../Middleware/AuthUser";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", AuthUser, profile);
export default router;
