import { BadRequestError } from "./appError";

const catchError = (err, res) => {
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} đã tồn tại, vui lòng nhập giá trị khác`;
    return new BadRequestError(message).send(res);
  }
  if (err.name == "ValidationError") {
    const test = Object.values(err.errors).map((item) => item.message);
    const message = test.join(", ");
    return new BadRequestError(message).send(res);
  }
  if (err.name == "CastError") {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new BadRequestError(message).send(res);
  }
  return new BadRequestError(err.message).send(res);
};
export default catchError;
