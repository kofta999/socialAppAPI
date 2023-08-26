import { Router } from "express";
import * as likesController from "../controllers/likes";

const router = Router();

// Posts
router.get("/posts/:postId", likesController.getLikesOfPost);
router.post("/posts/:postId", likesController.postLikePost);
router.delete("/posts/:likeId", likesController.deleteLikePostOrComment);

// Comments
router.get("/comments/:commentId", likesController.getLikesOfComment);
router.post("/comments/:commentId", likesController.postLikeComment);
router.delete("/comments/:likeId", likesController.deleteLikePostOrComment);

export default router;
