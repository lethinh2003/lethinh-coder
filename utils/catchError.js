const catchError = (err, res) => {
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} đã tồn tại, vui lòng nhập giá trị khác`;
    return res.status(400).json({
      status: "error",
      message: message,
    });
  }
  if (err.name == "ValidationError") {
    const test = Object.values(err.errors).map((item) => item.message);
    const message = test.join(", ");
    return res.status(400).json({
      status: "error",
      message: `Input error: ${message} `,
    });
  }
  if (err.name == "CastError") {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return res.status(400).json({
      status: "error",
      message: message,
    });
  } else {
    return res.status(400).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
export default catchError;
