import { Sequelize } from "sequelize";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    dialect: "postgres",
    host: "localhost",
  }
);

export const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.".cyan.bold);
    } catch (error) {
      console.log(process.env.PASSWORD, process.env.USERNAME, process.env.DBNAME);
      console.error("Unable to connect to the database:".cyan.bold, error);
    }
}
