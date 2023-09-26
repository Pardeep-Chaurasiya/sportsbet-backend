const { Tournament } = require("../models");

const createTournament = async (req, res) => {
  try {
    const {
      SelectionId,
      SelectionName,
      MarketTypeId,
      MarketName,
      MatchId,
      MatchName,
      RegionId,
      RegionName,
      CompetitionId,
      CompetitionName,
      SportName,
      SportFullName,
      Price,
      IsLive,
      Basis,
      MatchInfo,
      singleStake,
      MatchStartDate,
      EventEndDate,
    } = req.body;

    const user = req.User;

    const newTournament = await Tournament.create({
      SelectionId,
      SelectionName,
      MarketTypeId,
      MarketName,
      MatchId,
      MatchName,
      RegionId,
      RegionName,
      CompetitionId,
      CompetitionName,
      SportName,
      SportFullName,
      Price,
      IsLive,
      Basis,
      MatchInfo,
      singleStake,
      MatchStartDate,
      EventEndDate,
    });

    if (!newTournament) {
      return res.status(400).json({ message: "tournament not created" });
    }
    return newTournament;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { createTournament };
