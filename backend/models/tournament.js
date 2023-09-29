"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tournament.hasMany(models.Bet, { foreignKey: "tournamentId" });
    }
  }
  Tournament.init(
    {
      SelectionId: { type: DataTypes.INTEGER },
      SelectionName: { type: DataTypes.STRING },
      MarketTypeId: { type: DataTypes.INTEGER },
      MarketName: { type: DataTypes.STRING },
      MatchId: { type: DataTypes.INTEGER },
      MatchName: { type: DataTypes.STRING },
      RegionId: { type: DataTypes.INTEGER },
      RegionName: { type: DataTypes.STRING },
      CompetitionId: { type: DataTypes.INTEGER },
      CompetitionName: { type: DataTypes.STRING },
      SportId: { type: DataTypes.INTEGER },
      SportName: { type: DataTypes.STRING },
      SportFullName: { type: DataTypes.STRING },
      Price: { type: DataTypes.DECIMAL },
      IsLive: { type: DataTypes.INTEGER },
      Basis: { type: DataTypes.INTEGER },
      MatchInfo: { type: DataTypes.STRING },
      singleStake: { type: DataTypes.INTEGER },
      MatchStartDate: { type: DataTypes.DATE },
      EventEndDate: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Tournament",
    }
  );
  return Tournament;
};
