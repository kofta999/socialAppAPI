import { Request, Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import User from "../models/user";

// userId, postId => created comment
export const postCreateComment = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const postId = Number(req.query.postId);
  const content = req.body.content;
  try {
    if (!content) {
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      // I should also be able to use post.createComment({ content: content, userId: user.id})
      const comment = await user.createComment({
        content: content,
        postId: postId,
      });
      res.status(201).json({
        success: true,
        status_message: "comment created",
        results: { userId: user.id, postId: postId, commentId: comment.id },
      });
    }
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      console.log(err);
      res
        .status(500)
        .json({ success: false, status_message: "internal server error" });
    }
  }
};

// postId => comments for postId
export const getCommentsForPost = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const comments = await post.getComments();
      res.status(200).json({
        success: true,
        status_message: "fetched all comments",
        results: { comments: comments, postId: postId },
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// commentId => updated comment
export const putEditComment = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.query.commentId);
    const content = req.body.content;
    const comment = await Comment.findByPk(commentId);
    if (!content) {
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else if (!comment) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      comment.content = content;
      await comment.save();
      res.status(200).json({
        success: true,
        status_message: "updated comment",
        results: {
          commentId: commentId,
        },
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// commentId => removed comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.query.commentId);
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      comment.destroy();
      res.sendStatus(204);
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
