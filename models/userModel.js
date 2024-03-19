import { sequelize, DataTypes } from 'sequelize';

const User = sequelize.define("User", {
  // Define your user schema here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
  },
  getemail: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  dob: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
});

export default User;