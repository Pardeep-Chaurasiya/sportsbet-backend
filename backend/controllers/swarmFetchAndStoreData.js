const WebSocket = require("ws");
const { Tournament, Bet } = require("../models");

const fetchBetAndTournamentData = async (req, res) => {
  try {
    let flag = 0;
    tournamentmentData = await Bet.findAll({ raw: true });
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
      // console.log("calling data ", JSON.parse(sendingDataText_six));
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
          await saveData(matchResult, tournamentmentData[currentIndex - 1]);
        } catch (error) {
          console.error("Error while saving data:", error);
        }
      }
      flag = 1;
      if (
        tournamentmentData.length &&
        tournamentmentData.length > currentIndex
      ) {
        try {
          callSocket(tournamentmentData[currentIndex++]);
        } catch (error) {
          console.log("Error in calling socket:", error);
        }
      }
    });

    return res.json("fetching data");
  } catch (error) {
    console.error("Error in fetchBetAndTournamentData:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

async function saveData(result, tournament) {
  try {
    const data = JSON.parse(result.toString())?.data?.lines.line;
    if (data) {
      const matchInfo = tournament.MarketName;
      const idx = data.findIndex((el) => el.line_name === matchInfo);
      const matchResult =
        JSON.parse(result).data?.lines?.line[idx].events.event_name;
      let matchResultData = "";
      if (matchResult.length > 1) {
        matchResultData = JSON.stringify(matchResult);
      } else {
        matchResult.forEach((el) => {
          matchResultData += el;
        });
      }
      await Bet.update(
        {
          MatchInfo: matchResultData,
        },
        { where: { MatchId: tournament.MatchId } }
      );


        if(tournament.MatchInfo){
      if(tournament.SelectionName == tournament.MatchInfo){
        matchResultData = "WIN" 
        await Bet.update(
          {
            status: matchResultData,
          },
          { where: { MatchId: tournament.MatchId } }
        );
      }
      else
        {matchResultData="Lose" 
        await Bet.update(
          {
            status: matchResultData,
          },
          { where: { MatchId: tournament.MatchId } }
        )}
        }
    }
  } catch (error) {
    console.error("Error in saveData:", error);
  }
}

module.exports = { fetchBetAndTournamentData };
