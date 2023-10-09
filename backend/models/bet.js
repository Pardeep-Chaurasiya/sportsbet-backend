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
      Bet.belongsTo(models.User, {
        foreignKey: "userId",
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
      userId: DataTypes.INTEGER,
      tournamentId: DataTypes.INTEGER,
      command: { type: DataTypes.STRING },
      BetType: { type: DataTypes.INTEGER },
      AcceptMode: { type: DataTypes.INTEGER },
      Source: { type: DataTypes.INTEGER },
      TotalPrice: { type: DataTypes.DECIMAL },
      Amount: { type: DataTypes.DECIMAL },
      rid: { type: DataTypes.INTEGER },
      isLive: { type: DataTypes.BOOLEAN },
      status: { type: DataTypes.STRING, defaultValue: "WIN" },
      currency: { type: DataTypes.STRING, defaultValue: "$" },
    },
    {
      sequelize,
      modelName: "Bet",
    }
  );
  return Bet;
};
