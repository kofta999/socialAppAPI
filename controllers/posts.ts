import { Request, Response } from "express";
import Post from "../models/post";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
  }
};

export const postCreatePost = async (req: Request, res: Response) => {
  const postContent = req.body.content;
  const user = res.locals.user;
  try {
    if (!postContent) res.sendStatus(403);
    await user.createPost({ content: postContent });
    res.status(201).json({ message: "post created", userId: user.id });
  } catch (err) {
    console.log(err);
  }
};

export const putEditPost = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, userId: user.id },
    });
    const content = req.body.content;
    if (!post || !content) {
      res.sendStatus(400);
    } else {
      post.content = content;
      await post.save();
      res.status(200).json({ message: "updated post", userId: user.id });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    await Post.destroy({ where: { id: req.params.id, userId: user.id } });
    res.status(204).json({ message: "post deleted", userId: user.id });
  } catch (err) {
    console.log(err);
  }
};
