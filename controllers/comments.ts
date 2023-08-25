import { Request, Response } from "express";
import Post from "../models/post";
import Comment from "../models/comment";

// userId, postId => comment
export const postCreateComment = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const postId = parseInt(req.params.postId);
  const content = req.body.content;
  try {
    if (!content) res.sendStatus(400);

    // I should also be able to use post.createComment({ content: content, userId: user.id})
    await user.createComment({ content: content, postId: postId });
    res
      .status(201)
      .json({ message: "comment created", userId: user.id, postId: postId });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// postId => comments for postId
export const getCommentsForPost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const post: any = await Post.findByPk(postId);
    const comments = await post.getComments();
    if (!post || !comments) res.sendStatus(404);
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// commentId => updated comment
export const putEditComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const comment = await Comment.findByPk(commentId);
    if (!content) {
      res.sendStatus(400);
    } else if (!comment) {
      res.sendStatus(404);
    } else {
      comment.content = content;
      await comment.save();
      res
        .status(200)
        .json({ message: "updated comment", commentId: commentId });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

// commentId => no comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    console.log(req.params.commentId)
    const commentId = parseInt(req.params.commentId);
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      res.sendStatus(404);
    } else {
      comment.destroy();
      res.status(204).json({ message: "comment deleted" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
