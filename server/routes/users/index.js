const express = require("express");

const router = express.Router();

// GET /users
router.get("/", (req, res) => {
  // Logic to fetch all users
  res.send("Get all users");
});

// GET /users/:id
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic to fetch user by ID
  res.send(`Get user with ID ${userId}`);
});

// POST /users
router.post("/", (req, res) => {
  // Logic to create a new user
  res.send("Create a new user");
});

// PUT /users/:id
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic to update user by ID
  res.send(`Update user with ID ${userId}`);
});

// DELETE /users/:id
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  // Logic to delete user by ID
  res.send(`Delete user with ID ${userId}`);
});

module.exports = router;
