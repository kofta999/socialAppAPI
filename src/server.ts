import express from "express";
import sequelize from "./util/db";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import likesRouter from "./routes/likes";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile"
import relations from "./util/relations";

const app = express();
app.use(express.json());

app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);
app.use("/", authRouter);
app.use("/profile", profileRouter)
relations();

sequelize
  .sync()
  .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
  .catch((err) => console.log(err));
