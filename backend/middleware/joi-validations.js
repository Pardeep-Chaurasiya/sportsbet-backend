const Joi = require("joi");

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(null, ""),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{5,30}$/)
      .required(),
    source: Joi.number().required(),
    dialing_code: Joi.number().required(),
    mobilenumber: Joi.number().required(),
    CPassword: Joi.string()
      .pattern(/^[a-zA-Z0-9]{5,30}$/)
      .required(),
  })

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{5,30}$/)
      .required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = { validateRegistration, validateLogin };
