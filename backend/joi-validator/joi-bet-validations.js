const Joi = require("joi");

let selection = Joi.object().keys({
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

const validateCreateBet = (req, res, next) => {
  const schema = Joi.object({
    SelectionName: Joi.string(),
    MarketName: Joi.string(),
    MatchId: Joi.string(),
    MarketNameResult: Joi.string(),
    command: Joi.string(),
    BetType: Joi.number(),
    AcceptMode: Joi.number(),
    Source: Joi.number(),
    TotalPrice: Joi.number(),
    Amount: Joi.number(),
    rid: Joi.number(),

    Selections: Joi.array().items(selection),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

const validateBetHistory = (req, res, next) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    range: Joi.number(),
    status: Joi.string(),
    currency: Joi.string(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = {
  validateCreateBet,
  validateBetHistory,
};
