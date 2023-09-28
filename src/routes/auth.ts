import { Router } from "express";
import * as authController from "../controllers/auth";
import { signUpValidator, loginValidator } from "../util/validators";

const router = Router();

router.post("/signup", signUpValidator, authController.postSignup);
router.post("/login", loginValidator, authController.postLogin);

export default router