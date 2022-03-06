import dbConnect from "../../../../database/dbConnect";
import Code from "../../../../models/Code";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
import Comment from "../../../../models/Comment";
import initMiddleware from "../../../../lib/init-middleware";
import Cors from "cors";
import rateLimit from "../../../../lib/rate-limit";
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "https://www.lethinh-coder.site",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 20, // Max 20 users per second
});

const handle = async (req, res) => {
  const session = await getSession({ req });
  await cors(req, res);
  await dbConnect();
  await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
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
        await Promise.all([
          Code.find({
            _id: codeId,
          }),
          Comment.create({
            code: codeId,
            content: content,
            account: session.user.account,
          }),
        ]).then((data) => {
          return res.status(200).json({
            status: "success",
            message: "Comment thành công",
          });
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