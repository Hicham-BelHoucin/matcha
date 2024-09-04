const express = require("express");
const { login, logout, register } = require("./auth.service");
const { loginDto, registerDto } = require("./dto");
const createValidator = require("../validation");
const router = express.Router();

// login
router.post("/login", createValidator(loginDto), login);

// logout
router.post("/logout", logout);

// register
router.post("/register", createValidator(registerDto), register);

module.exports = router;
