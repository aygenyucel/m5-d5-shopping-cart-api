import { Sequelize } from "sequelize";

const { PG_DB, PG_USER, PG_HOST, PG_PASSWORD, PG_PORT } = process.env;

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to Postgres!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const syncModels = async () => {
  await sequelize.sync({ alter: true });
  console.log("All tables successfuly synchronized!");
};

export default sequelize;
