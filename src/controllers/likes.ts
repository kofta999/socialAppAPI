import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import Like from "../models/like";

// Helper functions

// query => likableId, likableType
const getLikable = (
  query: Request["query"]
): [number | null, typeof Post | typeof Comment | null] => {
  switch (true) {
    case !!query.postId:
      return [Number(query.postId), Post];
    case !!query.commentId:
      return [Number(query.commentId), Comment];
    default:
      return [null, null];
  }
};

// likableId, user => liked likable
export const postLikeLikable = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    res.status(400).json({
      success: false,
      status_message: "bad request",
    });
    return;
  }

  try {
    const likable: any = await likableClass.findByPk(likableId);
    if (!likable) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const likableType = likableClass.tableName.slice(0, -1);
      const like = await likable.createLike({ userId: user.id });
      res.status(200).json({
        success: true,
        status_message: "liked",
        results: {
          likableId: likableId,
          likableType: likableType,
          likeId: like.id,
        },
      });
    }
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      res
        .status(500)
        .json({ success: false, status_message: "internal server error" });
    }
  }
};

// likableId => likesCount
export const getLikesOfLikable = async (req: Request, res: Response) => {
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    res.status(400).json({
      success: false,
      status_message: "bad request",
    });
    return;
  }

  try {
    const likable: any = await likableClass.findByPk(likableId);
    if (!likable) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const likesCount = await likable.countLikes();
      const likableType = likableClass.tableName.slice(0, -1);
      res.status(200).json({
        success: true,
        status_message: "fetched likes",
        results: {
          likesCount: likesCount,
          likableId: likableId,
          likableType: likableType,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// likeId => unliked likable
export const deleteLikeOfLikable = async (req: Request, res: Response) => {
  const likeId = Number(req.query.likeId);
  try {
    const like = await Like.findByPk(likeId);
    if (!like) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      await like.destroy();
      res.sendStatus(204);
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
