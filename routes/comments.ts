import { Router } from "express";
import * as commentsController from "../controllers/comments"

const router = Router();

router.post("/", commentsController.postCreateComment);
router.get("/", commentsController.getCommentsForPost);
router.put("/", commentsController.putEditComment);
router.delete("/",  commentsController.deleteComment);

export default router