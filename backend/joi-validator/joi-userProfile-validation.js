const Joi = require("joi");

const validateChangePassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{5,30}$/)
      .required(),
    c_password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{5,30}$/)
      .required(),
    old_pass: Joi.string()
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

const validateUpdateUserProfile = (req, res, next) => {
  console.log(req.body)
  const schema = Joi.object({
    address: Joi.string().allow(null,""),
    gender: Joi.string().allow(null,""),
    idnumber: Joi.string().allow(null,""),
    nickname: Joi.string().allow(null,""),
    document_type: Joi.string().allow(null,""),
    dob: Joi.string().allow(null,""),
    firstName: Joi.string().allow(null,""),
    lastName: Joi.string().allow(null,""),
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
  validateChangePassword,
  validateUpdateUserProfile,
};
