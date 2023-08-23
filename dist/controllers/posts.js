"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreatePost = void 0;
const post_1 = __importDefault(require("../models/post"));
const postCreatePost = async (req, res) => {
    // get input data
    // create object in db
    // return res
    const postContent = req.body.content;
    try {
        if (!postContent)
            res.sendStatus(403);
        await post_1.default.create({ content: postContent });
        res.status(201).json({ message: "post created" });
    }
    catch (err) {
        console.log(err);
    }
};
exports.postCreatePost = postCreatePost;
