const { body } = require("express-validator");

const loginDto = [
  body("email").isEmail().escape().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .whitelist()
    .withMessage("Invalid password"),
];

const registerDto = [
  body("firstName").isLength({ min: 3 }).withMessage("Invalid first name"),
  body("lastName").isLength({ min: 3 }).withMessage("Invalid last name"),
  body("email").isEmail().withMessage("Invalid email"),
  // strong password validation at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
];

module.exports = {
  loginDto,
  registerDto,
};
