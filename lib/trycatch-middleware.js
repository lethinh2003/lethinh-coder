import catchError from "../utils/catchError";

export default function catchAsync(handle) {
  return (req, res) => {
    handle(req, res).catch((err) => catchError(err, res));
  };
}
