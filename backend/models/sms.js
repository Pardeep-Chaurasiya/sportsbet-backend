"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SMS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SMS.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  SMS.init(
    {
      otp: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SMS",
    }
  );
  return SMS;
};
