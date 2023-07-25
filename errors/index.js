const CustomError = require('./custom-error');
const BadRequestError = require('./bad-request');
const UnauthorizedError = require('./unauthenticated');
const NotFoundError = require('./not-found');

module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError
}