import { Router } from "express";
import * as commentsController from "../controllers/comments";
import { authenticateUser } from "../controllers/auth";
import { commentValidator } from "../util/validators";

const router = Router();

router.post("/", authenticateUser, commentValidator, commentsController.postCreateComment);
router.get("/", authenticateUser, commentsController.getCommentsForPost);
router.put("/", authenticateUser, commentValidator, commentsController.putEditComment);
router.delete("/", authenticateUser, commentsController.deleteComment);

export default router;
