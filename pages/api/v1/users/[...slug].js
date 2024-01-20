import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import UserService from "../../../../services/server/UserService";
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
      const slug = req.query.slug.join("");
      let query = {
        status: true,
        account: slug,
      };
      let options = {};
      const select = "-__v -password -refreshToken";
      const data = await UserService.findDetailedUser({
        query,
        select,
        options,
      });

      return new OkResponse({
        data,
        metadata: {
          ...req.query,
          slug,
        },
      }).send(res);
    } else {
      return new NotFoundError("Something went wrong").send(res);
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
