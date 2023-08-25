import express, { Request, Response } from "express";
import sequelize from "./util/db";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import relations from "./util/relations";
import User from "./models/user";
import { Model } from "sequelize";
// import session from "express-session";
// import passport from "passport";
// import dotenv from "dotenv";
// import authRouter from "./routes/auth"
// dotenv.config();

const app = express();
app.use(express.json());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req: Request, res: Response, next) => {
  User.findByPk(1)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
// app.use("/", authRouter)
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
