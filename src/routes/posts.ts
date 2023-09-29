import { Router } from "express";
import * as postsController from "../controllers/posts";
import { authenticateUser } from "../controllers/auth";
import { postValidator } from "../util/validators";

const router = Router();

router.post("/", authenticateUser, postValidator, postsController.postCreatePost);
router.get("/", authenticateUser, postsController.getPosts);
router.put("/", authenticateUser, postValidator, postsController.putEditPost);
router.delete("/", authenticateUser, postsController.deletePost);

export default router;
