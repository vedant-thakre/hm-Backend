import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

export const tempUser = sequelize.define(
  "tempuser",
  { name: DataTypes.STRING },
  { timestamps: false }
);
export const Task = sequelize.define(
  "task",
  { name: DataTypes.STRING },
  { timestamps: false }
);
export const Tool = sequelize.define(
  "tool",
  {
    name: DataTypes.STRING,
    size: DataTypes.STRING,
  },
  { timestamps: false }
);
tempUser.hasMany(tempUser);
Task.belongsTo(tempUser);
tempUser.hasMany(Tool, { as: "Instruments" });
