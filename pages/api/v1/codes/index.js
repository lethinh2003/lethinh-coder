import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import CodeService from "../../../../services/server/CodeService";
import { NotFoundError } from "../../../../utils/appError";
import catchError from "../../../../utils/catchError";
import { handleSortQueryMongoDB } from "../../../../utils/handleSortQueryMongoDB";
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
      const { sort = "-createdAt", results = 10, page = 1, searchQuery = "" } = req.query;
      let sortQuery = handleSortQueryMongoDB(sort);

      let query = {
        status: true,
      };
      let options = {};
      if (searchQuery) {
        query = { ...query, $text: { $search: searchQuery } };
        options = { ...options, score: { $meta: "textScore" } };
        sortQuery = { ...sortQuery, score: { $meta: "textScore" } };
      }
      const select = "-__v -link";
      const { limitItems, pageItem, data } = await CodeService.findCodes({
        query,
        sort: sortQuery,
        itemsOfPage: results,
        page,
        select,
        options,
      });

      return new OkResponse({
        data,

        metadata: {
          ...req.query,
          results: data.length,
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
