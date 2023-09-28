import { Request, Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import Post from "../models/post";
import Comment from "../models/comment";
import User from "../models/user";
import logger from "../util/logger";
import sequelize from "sequelize";
import Like from "../models/like";

// userId, postId => created comment
export const postCreateComment = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const postId = Number(req.query.postId);
  const content = req.body.content;
  try {
    if (!content || content === "") {
      logger.warn("bad request, content is not found");
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
      logger.info("a comment was created");
      res.status(201).json({
        success: true,
        status_message: "comment created",
        results: { userId: user.id, postId: postId, commentId: comment.id },
      });
    }
  } catch (err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      logger.warn("bad request, user does not exist");
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      logger.error(err.message);
      res
        .status(500)
        .json({ success: false, status_message: "internal server error" });
    }
  }
};

// postId => comments for postId
export const getCommentsForPost = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const postId = Number(req.query.postId);
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      logger.warn("post not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      const comments = await post.getComments({
        attributes: [
          "id",
          "content",
          "createdAt",
          "updatedAt",
          [sequelize.literal(`EXISTS (SELECT 1 FROM likes WHERE "likes"."likableId" = comment.id AND "likes"."likableType" = 'comment' AND "likes"."userId" = ${user.id})`), 'likedByUser'],
        ],
        include: [
          { model: User, attributes: ["id", "fullName"] },
          { model: Like, attributes: [] },
        ],
      });
      logger.info("fetched all comments for a post");
      res.status(200).json({
        success: true,
        status_message: "fetched all comments",
        results: { comments: comments, postId: postId },
      });
    }
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// commentId => updated comment
export const putEditComment = async (req: Request, res: Response) => {
  try {
    const user: User = res.locals.user;
    const commentId = Number(req.query.commentId);
    const content = req.body.content;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      logger.warn("comment not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (comment.userId !== user.id) {
      logger.warn("access forbidden for editing a comment for another user");
      res
        .status(403)
        .json({ success: false, status_message: "access forbidden" });
    } else if (!content) {
      logger.warn("bad request, no comment content to edit");
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      comment.content = content;
      await comment.save();
      logger.info("updated comment");
      res.status(200).json({
        success: true,
        status_message: "updated comment",
        results: {
          commentId: commentId,
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

// commentId => removed comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.query.commentId);
    const comment = await Comment.findByPk(commentId);
    const user = res.locals.user;
    if (!comment) {
      logger.warn("comment not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (comment.userId !== user.id) {
      logger.warn("access forbidden, trying to delete another user's comment");
      res
        .status(403)
        .json({ success: false, status_message: "access forbidden" });
    } else {
      comment.destroy();
      res.sendStatus(204);
    }
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
