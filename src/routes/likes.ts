import { Router } from "express";
import * as likesController from "../controllers/likes";

const router = Router();

router.post("/", likesController.postLikeLikable);
router.get("/", likesController.getLikesOfLikable);
router.delete("/", likesController.deleteLikeOfLikable);


export default router;
