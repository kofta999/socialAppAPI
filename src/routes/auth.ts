import { Router } from "express";
import * as authController from "../controllers/auth"

const router = Router();

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);

export default router