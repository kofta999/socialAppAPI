import { Sequelize } from "sequelize";

const sequelize = new Sequelize("socialApp", "root", "root", {
  dialect: "mysql",
});

export default sequelize;
