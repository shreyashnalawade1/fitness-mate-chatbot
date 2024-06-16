
const statusMessages = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    501 : "Not Implemented",
    502 : "Bad Gateway",
    503 : "Service Unavailable",
    504 : "Gateway Timeout",
    505 : "HTTP Version Not Supported"
  };
  class customError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    //    the stack trace will include the location where customError was created, making it easier to debug the error.
      Error.captureStackTrace(this, this.constructor);
      this.status = statusMessages[statusCode] || "Unknown Server Error !";
    }
  }
  
  module.exports = customError;