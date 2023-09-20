const { BadRequestError, UnauthorizedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const register = async (req, res, next) => {
  // const { username, email, password } = req.body;
  // if(!username || !email || !password) {
  //   const err = new BadRequestError('Usename, Password or Email is not Provided: fill all fields please');
  //   return next(err);
  // }
  try {
    const user = new User({ ...req.body });
    await user.save();
    const token = user.createJWT();
    res.cookie('token', token, {
      httpOnly: true,
      maxAge  :  1000 * 60 * 60 * 24
    });
    res.status(StatusCodes.CREATED)
    .json({ user: { id: user._id, username: user.username }, token});
  } catch (err) {
    console.error(err);
    next(err);
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    const err = new BadRequestError('Email and Password are required to Login. Please provide Email and Password');
    return next(err);
  }
  const user = await User.findOne({ email });
  if(!user) {
    const err = new UnauthorizedError('Invalid Credentials');
    return next(err);
  }
  // Using Custom Middleware To Compare 
  // Provided Password With Hashed One
  const passwordStatus = await user.comparePassword(password);
  if(!passwordStatus) {
    const err = new UnauthorizedError('Incorrect Password');
    return next(err);
  }
  const token = user.createJWT();
  res.cookie('token', token, {
    httpOnly : true,
    maxAge  :  1000 * 60 * 60 * 24
  });
  res.status(StatusCodes.OK).json({ user: { id: user._id, username: user.username }, token });
}

const logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 });
  res.redirect('/login');
}

module.exports = { 
  register, 
  login,
  logout
}