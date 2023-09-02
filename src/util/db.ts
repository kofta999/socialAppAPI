import { Sequelize } from "sequelize";

const databaseUrl =
  process.env.DATABASE_URL || "mysql://root:root@localhost:3306/socialApp";
const sequelize = new Sequelize(databaseUrl);

export default sequelize;
