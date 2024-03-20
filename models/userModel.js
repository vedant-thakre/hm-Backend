import { DataTypes } from 'sequelize';
import Otp from './otpModel.js';
import Address from './addressModel.js';
import { sequelize } from '../db/db.js';

const User = sequelize.define(
  "User",
  {
    // Define your user schema here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    getemail: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      default: false,
    },
  },
  {
    freezeTableName: true,
  }
);


export default User;

export const associate = (models) => {
  const { Otp } = models;
  User.hasMany(Otp, { as: "otps" });
  Otp.belongsTo(User);

  const { Address } = models;
  User.hasMany(Address, { as: "otps" });
  Address.belongsTo(User);
};
