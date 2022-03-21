import dbConnect from "../../../database/dbConnect";
import Blog from "../../../models/Blog";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";

const handle = async (req, res) => {
  try {
    await dbConnect();
    if (req.method === "GET") {
      const test = req.query.slug.join("/");
      const results = await Blog.find({
        slug: test,
      }).select("-link -__v");

      return res.status(200).json({
        status: "success",
        data: results,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
