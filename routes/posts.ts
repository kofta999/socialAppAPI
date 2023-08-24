import { Router } from "express";
import * as postsController from "../controllers/posts"

const router = Router();

router.post("/create", postsController.postCreatePost);
router.get("/list", postsController.getPosts);
router.put("/edit/:id", postsController.putEditPost);
router.delete("/delete/:id",  postsController.deletePost);

export default router