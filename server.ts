import express, { Express, RequestHandler } from "express";
import sequelize from "./util/db";
import postsRouter from "./routes/posts"

const app: Express = express();
app.use(express.json())
app.use("/posts", postsRouter);


sequelize
  .sync()
  .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
  .catch((err) => console.log(err));
