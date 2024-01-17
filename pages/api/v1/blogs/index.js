import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import BlogService from "../../../../services/server/BlogService";
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
      const { sort = "-createdAt", results = 10, page = 1 } = req.query;
      const query = {
        status: true,
      };
      const select = "-__v";
      const { limitItems, pageItem, data } = await BlogService.findBlogs({
        query,
        sort,
        itemsOfPage: results,
        page,
        select,
      });

      return new OkResponse({
        data,
        metadata: {
          ...req.query,
          page: pageItem,
          limit: limitItems,
          sort,
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
