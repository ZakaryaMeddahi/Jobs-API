const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST; // Bad Request Error status code
  }
}

module.exports = BadRequestError