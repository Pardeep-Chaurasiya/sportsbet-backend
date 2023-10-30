const Joi = require("joi");

const validateWalletId = (req, res, next) => {
  const schema = Joi.object({
    walletId: Joi.string().required(),
    walletToken: Joi.string().required(),
    balance: Joi.string(),
    virtualBlanace: Joi.string(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = {
  validateWalletId,
};
