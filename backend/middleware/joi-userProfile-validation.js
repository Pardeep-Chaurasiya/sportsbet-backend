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

const validateCreateUserProfile = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    address: Joi.string().required(),
    gender: Joi.string().required(),
    idnumber: Joi.string().required(),
    nickname: Joi.string().required(),
    document_type: Joi.string().required(),
    mobilenumber: Joi.string(),
    dob: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error, "---====>>>");
    return res.status(400).json({ error: error.details[0].message });
  }

  req.body = value;
  return next();
};

const validateUpdateUserProfile = (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string(),
    gender: Joi.string(),
    idnumber: Joi.string(),
    nickname: Joi.string(),
    document_type: Joi.string(),
    dob: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
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
  validateChangePassword,
  validateCreateUserProfile,
  validateUpdateUserProfile,
};
