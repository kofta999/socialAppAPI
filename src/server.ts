import sequelize from "./util/db";
import app from "./app";

sequelize
  .sync()
  .then(() => app.listen(3000, () => console.log("Connected on port 3000")))
  .catch((err) => console.log(err));
