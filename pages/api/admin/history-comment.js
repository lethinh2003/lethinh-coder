import dbConnect from "../../../database/dbConnect";
import Comment from "../../../models/Comment";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    if (session && session.user) {
      const results = await Comment.find({}).select("-__v");

      return res.status(200).json({
        status: "success",
        data: results,
      });
    }
    return res.status(404).json({
      status: "fail",
      message: "Đăng nhập để sử dụng api này",
    });
  }
};
export default handle;
