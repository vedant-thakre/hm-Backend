import { Sequelize } from "sequelize";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    const sequelize = new Sequelize(
      process.env.DBNAME,
      process.env.USERNAME,
      process.env.PASSWORD,
      {
        dialect: "postgres",
        host: "localhost",
      }
    );

    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.".cyan.bold);
    } catch (error) {
      console.error("Unable to connect to the database:".cyan.bold, error);
    }
}