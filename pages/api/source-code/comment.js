import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../models/Comment";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);
const handle = async (req, res) => {
  try {
    const session = await getSession({ req });
    await cors(req, res);
    await dbConnect();
    if (req.method === "GET") {
      const results = await Comment.find({}).select("-__v");
      return res.status(200).json({
        status: "success",
        data: results,
      });
    } else if (req.method === "POST") {
      if (session && session.user) {
        const { content, codeId } = req.body;
        const saveToDB = await Comment.create({
          code: codeId,
          content: content,
          account: session.user.account,
        });
        return res.status(200).json({
          status: "success",
          message: "Comment thành công",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Đăng nhập để comment",
        });
      }
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
