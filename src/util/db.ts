import { Sequelize } from "sequelize";
let sequelize: Sequelize;

if (process.env.NODE_ENV !== "test") {
  const databaseUrl =
    process.env.DATABASE_URL || "mysql://root:root@localhost:3306/socialApp";
  sequelize = new Sequelize(databaseUrl);
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
}

export default sequelize;
