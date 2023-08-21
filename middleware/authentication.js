const { UnauthorizedError } = require("../errors");
const jwt = require('jsonwebtoken');

// Check User Token
const authMiddleware = (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // if(!authHeader || !authHeader.startsWith('Bearer ')) {
  //   throw new UnauthorizedError('Invalid token');
  // }
  // token = authHeader.split(' ')[1];
  const token = req.cookies['token'];
  if(!token) {
    return res.redirect('/login');
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, username } = payload;
    req.user = { userId, username }
    next();
  } catch(err) {
    console.log(err);
    next(err);
  }
}

module.exports = authMiddleware