"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Application.belongsTo(models.UserWallet, {
        foreignKey: "walletAddress",
        onDelete: "CASCADE",
      });
    }
  }
  Application.init(
    {
      walletAddress: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      timestamp: { type: DataTypes.BIGINT },
    },
    {
      sequelize,
      modelName: "Application",
      timestamps: false,
    }
  );
  return Application;
};
