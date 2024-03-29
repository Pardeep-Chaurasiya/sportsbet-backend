"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bet.belongsTo(models.UserWallet, {
        foreignKey: "walletAddress",
        onDelete: "CASCADE",
      });
      Bet.belongsTo(models.Tournament, {
        foreignKey: "tournamentId",
        onDelete: "CASCADE",
      });
    }
  }
  Bet.init(
    {
      walletAddress: DataTypes.STRING,
      tournamentId: DataTypes.INTEGER,
      SelectionName: { type: DataTypes.STRING },
      MarketName: { type: DataTypes.STRING },
      MatchId: { type: DataTypes.STRING },
      command: { type: DataTypes.STRING },
      BetType: { type: DataTypes.INTEGER },
      AcceptMode: { type: DataTypes.INTEGER },
      Source: { type: DataTypes.INTEGER },
      TotalPrice: { type: DataTypes.DECIMAL(10, 2) },
      Amount: { type: DataTypes.DECIMAL(10, 2) },
      rid: { type: DataTypes.INTEGER },
      isLive: { type: DataTypes.BOOLEAN },
      status: { type: DataTypes.STRING, defaultValue: "Pending" },
      currency: { type: DataTypes.STRING, defaultValue: "$" },
    },
    {
      sequelize,
      modelName: "Bet",
    }
  );
  return Bet;
};
