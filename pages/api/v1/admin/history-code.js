import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import authMiddleware from "../../../../lib/auth-middleware";
import initMiddleware from "../../../../lib/init-middleware";
import catchAsync from "../../../../lib/trycatch-middleware";
import AdminService from "../../../../services/server/AdminService";
import { NotFoundError } from "../../../../utils/appError";
import { OkResponse } from "../../../../utils/successResponse";

const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET"],
  })
);

const handle = async (req, res) => {
  await cors(req, res);

  await dbConnect();
  if (req.method === "GET") {
    return new OkResponse({
      data: await AdminService.getHistoryDownloadCode(),
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(authMiddleware(handle, "admin"));
