"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.putEditPost = exports.postCreatePost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../models/post"));
const getPosts = async (req, res) => {
    try {
        const posts = await post_1.default.findAll();
        res.status(200).json(posts);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
exports.getPosts = getPosts;
const postCreatePost = async (req, res) => {
    const postContent = req.body.content;
    const user = res.locals.user;
    try {
        if (!postContent)
            res.sendStatus(400);
        await user.createPost({ content: postContent });
        res.status(201).json({ message: "post created", userId: user.id });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
exports.postCreatePost = postCreatePost;
const putEditPost = async (req, res) => {
    const user = res.locals.user;
    try {
        const post = await post_1.default.findOne({
            where: { id: req.params.id, userId: user.id },
        });
        const content = req.body.content;
        if (!post || !content) {
            res.sendStatus(400);
        }
        else {
            post.content = content;
            await post.save();
            res.status(200).json({ message: "updated post", userId: user.id });
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
exports.putEditPost = putEditPost;
const deletePost = async (req, res) => {
    try {
        const user = res.locals.user;
        await post_1.default.destroy({ where: { id: req.params.id, userId: user.id } });
        res.status(204).json({ message: "post deleted", userId: user.id });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
exports.deletePost = deletePost;
