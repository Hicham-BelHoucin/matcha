const { validationResult } = require("express-validator");

const validating = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    res.send({ errors: result.array().map((error) => error.msg) });
    return;
  }
  next();
};

const createValidator = (dto) => {
  return [...dto, validating];
};

module.exports = createValidator;
