"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserWallet.init(
    {
      walletAddress: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      walletToken: { type: DataTypes.STRING, allowNull: false },
      balance: { type: DataTypes.STRING, defaultValue: "0" },
      virtualBalance: { type: DataTypes.STRING, defaultValue: "100" },
      deposits: { type: DataTypes.JSON, defaultValue: null },
      claims: { type: DataTypes.JSON, defaultValue: null },
    },
    {
      sequelize,
      modelName: "UserWallet",
    }
  );
  return UserWallet;
};
