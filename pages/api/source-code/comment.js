import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
import Comment from "../../../models/Comment";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "https://www.lethinh-coder.site",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
const handle = async (req, res) => {
  const session = await getSession({ req });
  await cors(req, res);
  await dbConnect();
  if (req.method === "GET") {
    const results = await Comment.find({});
    return res.status(200).json({
      status: "success",
      data: results,
    });
  } else if (req.method === "POST") {
    if (session && session.user) {
      const { content, codeId } = req.body;
      try {
        const findCode = await Code.find({
          _id: codeId,
        });
        const saveToDB = await Comment.create({
          code: codeId,
          content: content,
          account: session.user.account,
        });
        return res.status(200).json({
          status: "success",
          message: "Comment thành công",
        });
      } catch (err) {
        return catchError(err, res);
      }
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Đăng nhập để comment",
      });
    }
  }
};
export default handle;
