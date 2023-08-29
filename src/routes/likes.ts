import { Router } from "express";
import * as likesController from "../controllers/likes";
import { authenticateUser } from "../controllers/auth";

const router = Router();

router.post("/", authenticateUser, likesController.postLikeLikable);
router.get("/", likesController.getLikesOfLikable);
router.delete("/", authenticateUser, likesController.deleteLikeOfLikable);

export default router;
