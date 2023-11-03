const WebSocket = require("ws");
const cron = require("cron");
const { UserWallet, Bet } = require("../models");

const fetchBetAndTournamentData = async (req, res) => {
  try {
    let flag = 0;
    betData = await Bet.findAll({
      where: { status: "Pending" },
      raw: true,
    });

    const url = "wss://eu-swarm-ws.betconstruct.com/";
    const ws = new WebSocket(url);
    let matchResult;
    let currentIndex = 0;
    function callSocket(item) {
      request_six = {
        command: "get_results",
        params: {
          game_id: item.MatchId,
        },
        rid: 13,
      };
      let sendingDataText_six = JSON.stringify(request_six);
      ws.send(sendingDataText_six);
    }
    ws.on("open", async () => {
      console.log("Connected to the WebSocket server");
      request_one = {
        command: "request_session",
        params: { site_id: 851, language: "eng" },
        rid: 1,
      };
      let sendingDataText = JSON.stringify(request_one);
      ws.send(sendingDataText);
    });

    ws.on("message", async (data) => {
      matchResult = data;
      if (flag) {
        try {
          await saveData(matchResult, betData[currentIndex - 1]);
        } catch (error) {
          console.error("Error while saving data:", error);
        }
      }
      flag = 1;
      if (betData.length && betData.length > currentIndex) {
        try {
          callSocket(betData[currentIndex++]);
        } catch (error) {
          console.log("Error in calling socket:", error);
        }
      }
    });

    // return res.json("fetching data");
  } catch (error) {
    console.error("Error in fetchBetAndTournamentData:", error);
    // return res.status(500).json({ error: "An error occurred" });
  }
};

async function saveData(result, betdata) {
  try {
    const data = JSON.parse(result.toString())?.data?.lines.line;
    if (data) {
      let matchFinalResult;
      let resultAmount = betdata?.Amount * betdata?.TotalPrice;

      const idx = data.findIndex((el) => el.line_name === betdata.MarketName);
      const matchResult =
        JSON.parse(result).data?.lines?.line[idx]?.events?.event_name;
      // console.log(matchResult);
      if (Array.isArray(matchResult) && matchResult.length >= 1) {
        const matchDataNewResult = data.find(
          (selection) =>
            selection.line_name == betdata.MarketName &&
            selection.events.event_name[0] == betdata.SelectionName
        );
        if (matchDataNewResult) {
          matchFinalResult = "WIN";
          await Bet.update(
            {
              status: matchFinalResult,
            },
            { where: { id: betdata.id } }
          );
        } else {
          matchFinalResult = "LOSE";
          await Bet.update(
            {
              status: matchFinalResult,
            },
            { where: { id: betdata.id } }
          );
        }

        wallet = await UserWallet.findAll({ raw: true });
        wallet.map(async (item) => {
          if (matchFinalResult == "WIN") {
            await UserWallet.update(
              {
                virtualBalance: parseFloat(item.virtualBalance) + resultAmount,
              },
              { where: { walletAddress: item.walletAddress } }
            );
          } else {
            await UserWallet.update(
              {
                virtualBalance: parseFloat(item.virtualBalance),
              },
              { where: { walletAddress: item.walletAddress } }
            );
          }
        });
      }
    }
  } catch (error) {
    console.error("Error in saveData:", error);
  }
}

const executeSwarm = () => {
  fetchBetAndTournamentData();
};

const job = new cron.CronJob("*/10 * * * * *", executeSwarm);

job.start();
