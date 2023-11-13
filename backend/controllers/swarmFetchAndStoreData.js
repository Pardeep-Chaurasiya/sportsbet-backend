const WebSocket = require("ws");
const cron = require("cron");
const { UserWallet, Bet } = require("../models");
const process = require("process");

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
          console.error("Error in calling socket:", error);
        }
      }
    });

    ws.on("error", () =>
      console.error("Network error. Please re-connect to the internet!!")
    );
  } catch (error) {
    console.error("Error in fetchBetAndTournamentData:", error);
  }
};

async function saveData(result, betdata) {
  try {
    const data = JSON.parse(result.toString())?.data?.lines?.line;

    if (data) {
      let matchFinalResult;
      const resultAmount = betdata?.Amount * betdata?.TotalPrice;

      const idx = data.findIndex((el) => el.line_name === betdata.MarketName);
      const matchResult =
        JSON.parse(result).data?.lines?.line[idx]?.events?.event_name;
      if (Array.isArray(matchResult) && matchResult.length >= 1) {
        const matchDataNewResult = data.find((selection) => {
          if (selection.line_name == betdata.MarketName) {
            for (i = 0; i < selection.events.event_name.length; i++) {
              if (selection.events.event_name[i] == betdata.SelectionName) {
                return 1;
              }
            }
          }
        });
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

        wallet = await UserWallet.findOne({
          where: { walletAddress: betdata.walletAddress },
          raw: true,
        });
        adminWallet = await UserWallet.findOne({
          where: { walletAddress: process.env.ADMIN_METAMASK_WALLET },
          raw: true,
        });

        if (matchFinalResult == "WIN") {
          let calc = (resultAmount * process.env.COMMISION_PERCENTAGE) / 100;

          await UserWallet.update(
            {
              virtualBalance:
                parseFloat(adminWallet.virtualBalance) - resultAmount + calc,
            },
            { where: { walletAddress: process.env.ADMIN_METAMASK_WALLET } }
          );
          await UserWallet.update(
            {
              virtualBalance:
                parseFloat(wallet.virtualBalance) + resultAmount - calc,
            },
            { where: { walletAddress: wallet.walletAddress } }
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in saveData:", error);
  }
}

const executeSwarm = () => {
  try {
    fetchBetAndTournamentData();
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const job = new cron.CronJob("*/59 * * * *", executeSwarm);

job.start();
