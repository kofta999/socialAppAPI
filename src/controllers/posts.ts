import { Request, Response } from "express";
import Post from "../models/post";

export const postCreatePost = async (req: Request, res: Response) => {
  const postContent = req.body.content;
  const user = res.locals.user;
  try {
    if (!postContent)
      res.status(400).json({ success: false, status_message: "bad request" });
    const post = await user.createPost({ content: postContent });
    res.status(201).json({
      success: true,
      status_message: "created post",
      results: {
        postId: post.id,
        userId: user.id,
      },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({
      success: true,
      status_message: "fetched all posts",
      results: posts,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

export const putEditPost = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const postId = Number(req.query.postId);
  try {
    const post = await Post.findOne({
      where: { id: postId, userId: user.id },
    });
    const content = req.body.content;
    if (!post) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (!content) {
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else {
      post.content = content;
      await post.save();
      res.status(200).json({
        success: true,
        status_message: "updated post",
        results: {
          userId: user.id,
          postId: post.id,
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

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const postId = Number(req.query.postId);
    const destroyedPosts = await Post.destroy({
      where: { id: postId, userId: user.id },
    });
    if (destroyedPosts === 0) {
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else {
      res.sendStatus(204);
      // res.status(204).json({
      //   success: true,
      //   status_message: "post deleted",
      //   results: {
      //     userId: user.id,
      //     postId: postId,
      //   },
      // });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
