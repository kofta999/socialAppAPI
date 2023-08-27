import { Router } from "express";
import * as postsController from "../controllers/posts"

const router = Router();

router.post("/", postsController.postCreatePost);
router.get("/", postsController.getPosts);
router.put("/", postsController.putEditPost);
router.delete("/",  postsController.deletePost);

export default router