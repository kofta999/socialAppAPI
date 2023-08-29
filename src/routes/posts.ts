import { Router } from "express";
import * as postsController from "../controllers/posts";
import { authenticateUser } from "../controllers/auth";

const router = Router();

router.post("/", authenticateUser, postsController.postCreatePost);
router.get("/", postsController.getPosts);
router.put("/", authenticateUser, postsController.putEditPost);
router.delete("/", authenticateUser, postsController.deletePost);

export default router;
