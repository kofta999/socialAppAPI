import { Router } from "express";
import * as likesController from "../controllers/likes";

const router = Router();

router.get("/", likesController.getLikesOfLikable);
router.post("/", likesController.postLikeLikable);
router.delete("/", likesController.deleteLikeOfLikable);


export default router;
