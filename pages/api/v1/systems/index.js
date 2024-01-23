import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import catchAsync from "../../../../lib/trycatch-middleware";
import SystemService from "../../../../services/server/SystemService";
import { NotFoundError } from "../../../../utils/appError";
import { OkResponse } from "../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);

const handle = async (req, res) => {
  await cors(req, res);
  await dbConnect();
  if (req.method === "GET") {
    let query = {};
    let options = {};
    const select = "-__v";
    const data = await SystemService.findDetailedSystem({
      query,
      select,
      options,
    });

    return new OkResponse({
      data,
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(handle);
