"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.OTP, { foreignKey: "userId" });
      User.hasOne(models.UserProfile, { foreignKey: "userId" });
      User.hasMany(models.Bet, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      source: { type: DataTypes.INTEGER },
      dialing_code: { type: DataTypes.STRING, allowNull: false },
      mobilenumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
