const Joi = require("joi");

const validateWithdrawalAmount = (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string(),
    timestamp: Joi.date(),
    withdrawalAmount: Joi.number(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = {
  validateWithdrawalAmount,
};
