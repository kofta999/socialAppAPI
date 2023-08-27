import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || "socialApp",
  process.env.DATABASE_USERNAME || "root",
  process.env.DATABASE_PASSWORD || "root",
  {
    dialect: "mysql",
  }
);

export default sequelize;
