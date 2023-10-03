const { Bet, Tournament } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment");

// create bet for torunament for tricky-route api
const createBet = async (req, res) => {
  try {
    const {
      command,
      BetType,
      AcceptMode,
      Source,
      TotalPrice,
      Amount,
      rid,
      Selections,
    } = req.body;
    const user = req.User;
    const isTournamentCreated = await Tournament.findOne({
      where: {
        [Op.or]: {
          MatchId: Selections[0].MatchId,
          SportId: Selections[0].SportId,
        },
      },
    });
    if (isTournamentCreated) {
      const newBet = await Bet.create({
        command,
        BetType,
        AcceptMode,
        Source,
        TotalPrice,
        Amount,
        rid,
        userId: user.id,
        tournamentId: isTournamentCreated.dataValues.id,
      });
    } else {
      const newTournament = await Tournament.bulkCreate(Selections);
      const newBet = await Bet.create({
        command,
        BetType,
        AcceptMode,
        Source,
        TotalPrice,
        Amount,
        rid,
        userId: user.id,
        tournamentId: newTournament[0].dataValues.id,
      });
    }
    return res.status(200).json({ message: "Bet created successfully !!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// getting bet history
const betHistory = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(req.body, "----->>>>>");

  const user = req.User.id;

  try {
    const history = await Bet.findAll({
      where: {
        userId: user,
        createdAt: {
          [Op.gte]: moment(startDate)
            .startOf("day")
            .format("YYYY-MM-DD h:mm:ss"),
          [Op.lte]: moment(endDate).endOf("day").format("YYYY-MM-DD h:mm:ss"),
        },
      },
      raw: true,
    });

    res.json(history);
  } catch (error) {
    console.error("Error fetching betting history:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBet, betHistory };
