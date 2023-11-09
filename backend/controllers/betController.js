const { Bet, Tournament, UserWallet } = require("../models");
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
    // const user = req.id;
    const user = req.UserWallet;
    const userwallet = await UserWallet.findOne({
      where: { walletAddress: user.address },
    });
    const virtualBalance = userwallet.virtualBalance;

    if (virtualBalance >= 0 && virtualBalance >= Amount) {
      const isTournamentCreated = await Tournament.findOne({
        where: {
          [Op.and]: {
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
          SelectionName: Selections[0].SelectionName,
          MarketName: Selections[0].MarketName,
          MatchId: Selections[0].MatchId,
          // userId: user.id,
          walletAddress: user.address,
          tournamentId: isTournamentCreated.dataValues.id,
        });
        await UserWallet.update(
          {
            virtualBalance: parseFloat(virtualBalance) - Amount,
          },
          { where: { walletAddress: user.address } }
        );
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
          SelectionName: Selections[0].SelectionName,
          MarketName: Selections[0].MarketName,
          MatchId: Selections[0].MatchId,
          // userId: user.id,
          walletAddress: user.address,
          tournamentId: newTournament[0].dataValues.id,
        });
        await UserWallet.update(
          {
            virtualBalance: parseFloat(virtualBalance) - Amount,
          },
          { where: { walletAddress: user.address } }
        );
      }
      return res.status(200).json({ message: "Bet created successfully !!" });
    } else {
      return res.status(400).json({ message: "Wallet Balance is low" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// getting bet history
const betHistory = async (req, res) => {
  const { startDate, endDate } = req.body;
  const user = req.UserWallet.address;

  try {
    const history = await Bet.findAll({
      where: {
        walletAddress: user,
        createdAt: {
          [Op.gte]: moment(startDate).startOf("day").format(),
          [Op.lte]: moment(endDate).endOf("day").format(),
        },
      },
      include: [
        {
          model: Tournament,
          attributes: ["MatchName"],
        },
      ],
      raw: true,
    });
    const updatedHistory = history.map((item) => ({
      ...item,
      possible_win: item.Amount * item.TotalPrice,
      // match_name: item.Tournament ? item.Tournament.MatchName : null,
    }));
    updatedHistory.map((i) => {
      console.log(i.MatchId, "=============================");
      console.log(i["Tournament.MatchName"], "\n**************");
    });
    return res.json(updatedHistory);
  } catch (error) {
    console.error("Error fetching betting history:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createBet, betHistory };
