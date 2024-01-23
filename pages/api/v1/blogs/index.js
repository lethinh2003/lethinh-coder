import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import catchAsync from "../../../../lib/trycatch-middleware";
import BlogService from "../../../../services/server/BlogService";
import { NotFoundError } from "../../../../utils/appError";
import { handleSortQueryMongoDB } from "../../../../utils/handleSortQueryMongoDB";
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
    const { sort = "-createdAt", results = 10, page = 1, searchQuery = "", labelQuery = "" } = req.query;

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
    if (labelQuery) {
      query = {
        ...query,
        labels: {
          $in: labelQuery.split(","),
        },
      };
    }
    const select = "-__v";
    const { limitItems, pageItem, data } = await BlogService.findBlogs({
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
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(handle);
