const express = require("express");
const swarmData = require("../controllers/swarmFetchAndStoreData");

const router = express.Router();

router.get("/fetchBetsEventData", swarmData.fetchBetAndTournamentData);

module.exports = router;
