import { Request, Response } from "express";
import User from "../models/user";
import logger from "../util/logger";
import Post from "../models/post";
import Like from "../models/like";

export const getProfile = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email"],
    });
    const userPosts = await Post.scope({
      method: ["withLikesAndComments", userId],
    }).findAll({
      where: { userId: userId },
    });

    // Access the user's posts using user.Posts
    if (!user) {
      logger.warn("user not found");
      res
        .status(404)
        .json({ success: false, status_message: "user not found" });
      return;
    }
    logger.info("user found");
    res.status(200).json({
      success: true,
      status_message: "user found",
      results: { user: user, userPosts: userPosts },
    });
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
