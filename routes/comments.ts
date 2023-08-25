import { Router } from "express";
import * as commentsController from "../controllers/comments"

const router = Router();

router.post("/create/:postId", commentsController.postCreateComment);
router.get("/list/:postId", commentsController.getCommentsForPost);
router.put("/edit/:commentId", commentsController.putEditComment);
router.delete("/delete/:commentId",  commentsController.deleteComment);

export default router