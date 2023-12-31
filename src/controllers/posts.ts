import { Request, Response } from "express";
import { validationErrorHandler } from "../util/validators"
import Post from "../models/post";
import User from "../models/user";
import logger from "../util/logger";

const POSTS_PER_PAGE = 10;

// post content, user => created post with content and user
export const postCreatePost = async (req: Request, res: Response) => {
  const possibleErrors = validationErrorHandler(req);
  if (possibleErrors.length > 0) {
    logger.warn("error in validation")
    return res.status(422).json({
      success: false,
      status_message: "error happened while validating input, check your input",
      results: {
        errors: possibleErrors
      }
    })
  }
  const postContent = req.body.content;
  const user: User = res.locals.user;
  try {
    if (!postContent || postContent === "") {
      logger.warn("bad request, no post content");
      res.status(400).json({ success: false, status_message: "bad request" });
      return;
    }
    const post = await user.createPost({ content: postContent });
    logger.info("created post");
    res.status(201).json({
      success: true,
      status_message: "created post",
      results: {
        postId: post.id,
        userId: user.id,
        userFullName: user.fullName,
      },
    });
  } catch (err: any) {
    console.log(err);
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// none => all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const user: User = res.locals.user;
    let page = parseInt(req.query.page as string);
    if (!page) { page = 1 }
    const posts = await Post.scope({
      method: ["withLikesAndComments", user.id],
    }).findAll({ limit: POSTS_PER_PAGE, offset: (page - 1) * POSTS_PER_PAGE });
    logger.info("fetched all posts");
    res.status(200).json({
      success: true,
      status_message: "fetched all posts",
      results: {
        posts: posts,
      },
    });
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

// postId, user, content => edited post with new content
export const putEditPost = async (req: Request, res: Response) => {
  const possibleErrors = validationErrorHandler(req);
  if (possibleErrors.length > 0) {
    logger.warn("error in validation")
    return res.status(422).json({
      success: false,
      status_message: "error happened while validating input, check your input",
      results: {
        errors: possibleErrors
      }
    })
  }
  const user = res.locals.user;
  const postId = Number(req.query.postId);
  try {
    const post = await Post.findByPk(postId);
    const content: string = req.body.content;
    if (!content || content === "") {
      logger.warn("bad request, no post content");
      res.status(400).json({
        success: false,
        status_message: "bad request",
      });
    } else if (!post) {
      logger.warn("post not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (post.userId !== user.id) {
      logger.warn("access forbidden, a user tries to edit another user's post");
      res
        .status(403)
        .json({ success: false, status_message: "access forbidden" });
    } else {
      post.content = content;
      await post.save();
      logger.info("updated post content");
      res.status(200).json({
        success: true,
        status_message: "updated post",
        results: {
          userId: user.id,
          postId: post.id,
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

// user, postId => removed post with postId and user
export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const postId = Number(req.query.postId);
    const post = await Post.findByPk(postId);
    if (!post) {
      logger.warn("post not found");
      res.status(404).json({
        success: false,
        status_message: "the requested resource is not found",
      });
    } else if (post.userId !== user.id) {
      logger.warn(
        "access forbidden, a user tries to delete another user's post"
      );
      res
        .status(403)
        .json({ success: false, status_message: "access forbidden" });
    } else {
      logger.info("post deleted");
      post.destroy();
      res.sendStatus(204);
    }
  } catch (err: any) {
    logger.error(err.message);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
