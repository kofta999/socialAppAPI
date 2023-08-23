import { Request, Response } from "express";
import Post from "../models/post";

export const postCreatePost = async (req: Request, res: Response) => {
  // get input data
  // create object in db
  // return res

  const postContent = req.body.content;
  try {
    if (!postContent) res.sendStatus(403);
    await Post.create({ content: postContent });
    res.status(201).json({ message: "post created" });
  } catch (err) {
    console.log(err);
  }
};
