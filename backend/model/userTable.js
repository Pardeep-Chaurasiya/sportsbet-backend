const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    CPassword: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.INTEGER },
    dialing_code: { type: DataTypes.INTEGER, allowNull: false },
    mobilenumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    hash: { type: DataTypes.STRING },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);

module.exports = User;
