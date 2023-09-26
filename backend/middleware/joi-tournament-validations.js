const Joi = require("joi");

const validateCreateTournament = (req, res, next) => {
  const schema = Joi.object({
    SelectionId: Joi.number(),
    SelectionName: Joi.string(),
    MarketTypeId: Joi.number(),
    MarketName: Joi.string(),
    MatchId: Joi.number(),
    MatchName: Joi.string(),
    RegionId: Joi.number(),
    RegionName: Joi.string(),
    CompetitionId: Joi.number(),
    CompetitionName: Joi.string(),
    SportId: Joi.number(),
    SportName: Joi.string(),
    SportFullName: Joi.string(),
    Price: Joi.number(),
    IsLive: Joi.number(),
    Basis: Joi.number(),
    MatchInfo: Joi.string().allow(null, ""),
    singleStake: Joi.number(),
    MatchStartDate: Joi.date(),
    EventEndDate: Joi.date(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error, "---====>>>");
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = {
  validateCreateTournament,
};
