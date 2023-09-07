import express from "express";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import likesRouter from "./routes/likes";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import "./util/relations";

const app = express();
app.use(express.json());

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1/profile", profileRouter);

export default app;
