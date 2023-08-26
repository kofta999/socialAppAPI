import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import Like from "../models/like";

// postId => likesCount
export const getLikesOfPost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const post: any = await Post.findByPk(postId);
    if (!post) {
      res.sendStatus(404);
    } else {
      const likesCount = await post.countLikes();
      res.status(200).json({ likesCount: likesCount, postId: postId });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// postId, user => liked post
export const postLikePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const user = res.locals.user;
  try {
    const post: any = await Post.findByPk(postId);
    if (!post) {
      res.sendStatus(404);
    } else {
      await post.createLike({ userId: user.id });
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

// commentId => likesCount
export const getLikesOfComment = async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  try {
    const comment: any = await Comment.findByPk(commentId);
    if (!comment) {
      res.sendStatus(404);
    } else {
      const likesCount = await comment.countLikes();
      res.status(200).json({ likesCount: likesCount, commentId: commentId });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// commentId, user => liked comment
export const postLikeComment = async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const user = res.locals.user;
  try {
    const comment: any = await Comment.findByPk(commentId);
    if (!comment) {
      res.sendStatus(404);
    } else {
      await comment.createLike({ userId: user.id });
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

// likeId => Unliked post or comment
export const deleteLikePostOrComment = async (req: Request, res: Response) => {
  const likeId = parseInt(req.params.likeId);
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
