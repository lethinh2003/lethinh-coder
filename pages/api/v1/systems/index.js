import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import SystemService from "../../../../services/server/SystemService";
import { NotFoundError } from "../../../../utils/appError";
import catchError from "../../../../utils/catchError";
import { OkResponse } from "../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);

const handle = async (req, res) => {
  try {
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
      return new NotFoundError("Something went wrong").send(res);
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
