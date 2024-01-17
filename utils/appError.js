const STATUSCODE = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};
const STATUSREASON = {
  NOT_FOUND: "Not found",
  UNAUTHORIZED: "Unauthorized",
  BAD_REQUEST: "Bad request",
};
class AppError extends Error {
  constructor(message, statusCode, status = "error") {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
  send(res, header = {}) {
    return res.status(this.statusCode).json({ ...this, message: this.message });
  }
}
class NotFoundError extends AppError {
  constructor(message) {
    super(message, STATUSCODE.NOT_FOUND, STATUSREASON.NOT_FOUND);
  }
}
class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, STATUSCODE.UNAUTHORIZED, STATUSREASON.UNAUTHORIZED);
  }
}
class BadRequestError extends AppError {
  constructor(message) {
    super(message, STATUSCODE.BAD_REQUEST, STATUSREASON.BAD_REQUEST);
  }
}

export default AppError;
export { BadRequestError, NotFoundError, UnauthorizedError };
