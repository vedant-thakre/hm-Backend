import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";


const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
  }
);

// Request.sync({})
//   .then(() => {
//     console.log("New request model migrated successfully");
//   })
//   .catch(() => {
//     console.log("Error migrating new request model:", error);
//   })

export default Request;
