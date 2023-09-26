const express = require("express");
const tournamentController = require("../controllers/tournamentController");
const joi_validator = require("../middleware/joi-tournament-validations");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// create tournament
router.post(
  "/create-tournament",
  authMiddleware,
  joi_validator.validateCreateTournament,
  tournamentController.createTournament
);

module.exports = router;
