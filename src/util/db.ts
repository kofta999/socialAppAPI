import { Sequelize } from "sequelize";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://root:gsDeE7S8ONK0GZ71awNZizcAvgWO2jDW@dpg-cjl68dtk5scs739htt4g-a.frankfurt-postgres.render.com/social_app_ep64";
const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Set to false if using self-signed certificates
    },
  },
});

export default sequelize;
