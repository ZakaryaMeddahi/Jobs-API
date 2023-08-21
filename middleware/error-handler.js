// const { CustomError } = require("../errors");
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message : err.message || 'Somthing went wrong in the server'
  }
  // if(err instanceof CustomError) {
  //   return res.status(err.statusCode).json( { messsage: err.message } );
  // }
  // Field Not Prodided Error
  if(err.name === 'ValidationError') {
    const fields = Object.keys(err.errors);
    let message = '';
    for(let i = 0; i < fields.length; i++) {
      if(i !== fields.length-1) {
        message += `${fields[i]}, `;
        continue;
      }
      message += `${fields[i]}.`;
    }
    customError.message = `Please provide valide ${message}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Send Duplicate Email Error (Email Already Exist In The DB)
  if(err.code === 11000) {
    customError.message = `Dublicate value for ${ Object.keys(err.keyValue) }: Please try another one`;
    customError.statusCode=StatusCodes.BAD_REQUEST;
  }
  // ID Syntax Is Not Correct
  if(err.name === 'CastError') {
    customError.message = `ID syntax is not correct: Provide a valide ID please`;
    customError.statusCode=StatusCodes.BAD_REQUEST;
  }
  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json( { err } );
  res.status(customError.statusCode).json( { message: customError.message } );
}

module.exports = errorHandler