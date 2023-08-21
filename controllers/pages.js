const { StatusCodes } = require("http-status-codes");

const register = (req, res) => {
  res.status(StatusCodes.OK).render('register');
};

const login = (req, res) => {
  res.status(StatusCodes.OK).render('login');
}

module.exports = {
  register,
  login
}