const Joi = require("joi");

const validateCreateBet = (req, res, next) => {
  const schema = Joi.object({
    command: Joi.string(),
    BetType: Joi.number(),
    AcceptMode: Joi.number(),
    Source: Joi.number(),
    TotalPrice: Joi.number(),
    Amount: Joi.number(),
    rid: Joi.number(),
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
  validateCreateBet,
};
