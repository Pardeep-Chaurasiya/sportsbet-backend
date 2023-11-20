const Joi = require("joi");

const validateWithdrawalAmount = (req, res, next) => {
  const schema = Joi.object({
    walletId: Joi.string(),
    walletToken: Joi.string(),
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
