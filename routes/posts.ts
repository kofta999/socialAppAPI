import { Router } from "express";
import * as postsController from "../controllers/posts"

const router = Router();

router.post("/create", postsController.postCreatePost);
router.get("/list");
router.put("/:id/update");
router.delete("/:id/delete");

export default router