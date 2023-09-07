import { Sequelize } from "sequelize";
let sequelize: Sequelize;

const databaseUrl =
  process.env.DATABASE_URL || "mysql://root:root@localhost:3306/socialApp";
  
sequelize = new Sequelize(databaseUrl);

export default sequelize;
