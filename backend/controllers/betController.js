const { Bet, Tournament } = require("../models");
const { createTournament } = require("./tournamentController");

const createBet = async (req, res) => {
  try {
    console.log(
      "------------------------",
      req.body,
      "--------------------------------"
    );
    const { command, BetType, AcceptMode, Source, TotalPrice, Amount, rid } =
      req.body;

    const user = req.User;
    const abc = await createTournament();
    console.log(abc);
    // return;
    const newBet = await Bet.create({
      command,
      BetType,
      AcceptMode,
      Source,
      TotalPrice,
      Amount,
      rid,
      userId: user.id,
      //   tournamentId:
    });

    if (!newBet) {
      return res.status(400).json({ message: "bet not created" });
    }
    return res.status(200).json({ message: "Bet created successfully !!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { createBet };
