const login = async (req, res) => {
  res.send("Login user");
};

const logout = async (req, res) => {
  // Logic to log out a user
  res.send("Log out user");
};

const register = async (req, res) => {
  // Logic to register a user
  res.send("Register user");
};

module.exports = {
  login,
  logout,
  register,
};
