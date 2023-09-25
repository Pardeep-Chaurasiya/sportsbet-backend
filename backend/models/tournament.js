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
      SelectionId: { type: DataTypes.STRING },
      SelectionName: { type: DataTypes.STRING },
      MarketTypeId: { type: DataTypes.INTEGER },
      MarketName: { type: DataTypes.INTEGER },
      MatchId: { type: DataTypes.DECIMAL },
      MatchName: { type: DataTypes.DECIMAL },
      RegionId: { type: DataTypes.INTEGER },
      RegionName: { type: DataTypes.BOOLEAN },
      CompetitionId: { type: DataTypes.STRING },
      CompetitionName: { type: DataTypes.STRING },
      SportId: { type: DataTypes.INTEGER },
      SportName: { type: DataTypes.INTEGER },
      SportFullName: { type: DataTypes.DECIMAL },
      Price: { type: DataTypes.DECIMAL },
      IsLive: { type: DataTypes.INTEGER },
      Basis: { type: DataTypes.BOOLEAN },
      MatchInfo: { type: DataTypes.STRING },
      singleStake: { type: DataTypes.STRING },
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
