import { Router } from "express";
import * as commentsController from "../controllers/comments";
import { authenticateUser } from "../controllers/auth";

const router = Router();

router.post("/", authenticateUser, commentsController.postCreateComment);
router.get("/", authenticateUser, commentsController.getCommentsForPost);
router.put("/", authenticateUser, commentsController.putEditComment);
router.delete("/", authenticateUser, commentsController.deleteComment);

export default router;
