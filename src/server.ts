import express, { Request, Response } from "express";
import sequelize from "./util/db";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import likesRouter from "./routes/likes";
import authRouter from "./routes/auth";
import relations from "./util/relations";
import User from "./models/user";

const app = express();
app.use(express.json());

// app.use((req: Request, res: Response, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       res.locals.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);
app.use("/", authRouter);
relations();

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        fullName: "admin",
        email: "admin@admin.com",
        hashedPassword: "admin",
      });
    }
    return user;
  })
  .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
  .catch((err) => console.log(err));
