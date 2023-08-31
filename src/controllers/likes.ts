import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import Like from "../models/like";
import logger from "../util/logger";

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
    logger.warn("bad request, likable class or id is null");
    res.status(400).json({
      success: false,
      status_message: "bad request",
    });
    return;
  }

  try {
    const likable = await likableClass.findByPk<Comment | Post>(likableId);
    if (!likable) {
      logger.warn("likable not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const likableType = likableClass.tableName.slice(0, -1);
      if (
        await Like.findOne({
          where: {
            likableId: likable.id,
            userId: user.id,
            likableType: likableType,
          },
        })
      ) {
        logger.warn("bad request, already liked likable");
        res.status(400).json({
          success: false,
          status_message: "bad request",
        });
        return;
      }
      const like = await likable.createLike({ userId: user.id });
      logger.info("liked a likable");
      res.status(200).json({
        success: true,
        status_message: "liked",
        results: {
          likableId: likableId,
          likableType: likableType,
          commentId: like.id,
        },
      });
    }
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// likableId => likesCount
export const getLikesOfLikable = async (req: Request, res: Response) => {
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    logger.warn("bad request, likable class or id is null");
    res.status(400).json({
      success: false,
      status_message: "bad request",
    });
    return;
  }

  try {
    const likable = await likableClass.findByPk<Post | Comment>(likableId);
    if (!likable) {
      logger.warn("likable not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const likesCount = await likable.countLikes();
      const likableType = likableClass.tableName.slice(0, -1);
      logger.info("fetched likes for likable");
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
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// commentId => unliked likable
export const deleteLikeOfLikable = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    logger.warn("bad request, likable class or id is null");
    res.status(400).json({
      success: false,
      status_message: "bad request",
    });
    return;
  }

  try {
    const likableType = likableClass.tableName.slice(0, -1);
    const like = await Like.findOne({
      where: {
        likableId: likableId,
        likableType: likableType,
        userId: user.id,
      },
    });
    if (!like) {
      logger.warn("like not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (like.userId !== user.id) {
      logger.warn(
        "access forbidden, a user trying to remove a like of another user"
      );
      res
        .status(403)
        .json({ success: false, status_message: "access forbidden" });
    } else {
      await like.destroy();
      res.sendStatus(204);
    }
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
