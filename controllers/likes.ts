import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import Like from "../models/like";

// Helper functions

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

// likeableId => likesCount
export const getLikesOfLikable = async (req: Request, res: Response) => {
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const likable: any = await likableClass.findByPk(likableId);
    if (!likable) {
      res.sendStatus(404);
    } else {
      const likesCount = await likable.countLikes();
      res.status(200).json({
        likesCount: likesCount,
        likableId: likableId,
        likableType: likableClass.tableName,
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// likableId, user => liked likable
export const postLikeLikable = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const [likableId, likableClass] = getLikable(req.query);
  if (likableId == null || likableClass == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const likable: any = await likableClass.findByPk(likableId);
    if (!likable) {
      res.sendStatus(404);
    } else {
      await likable.createLike({ userId: user.id });
      res.status(200).json({ message: "like created" });
    }
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.sendStatus(400);
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  }
};

// likeId => Unliked likable
export const deleteLikeOfLikable = async (req: Request, res: Response) => {
  const likeId = Number(req.query.likeId);
  try {
    const like = await Like.findByPk(likeId);
    if (!like) {
      res.sendStatus(404);
    } else {
      await like.destroy();
      res.status(204).json({ message: "like removed" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
