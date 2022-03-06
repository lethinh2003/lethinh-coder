import dbConnect from "../../../../database/dbConnect";
import Code from "../../../../models/Code";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
import Comment from "../../../../models/Comment";
import User from "../../../../models/User";
import HistoryLike from "../../../../models/HistoryLike";
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
  const { codeId } = req.query;

  await cors(req, res);
  await dbConnect();
  await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
  if (req.method === "POST") {
    if (session && session.user) {
      const { commentId, accountId } = req.body;
      try {
        const findComment = Comment.find({
          _id: commentId,
        });

        const findUser = User.find({
          _id: accountId,
        });
        const checkUserLikedComment = Comment.find({
          _id: commentId,
          likes: { $in: [accountId] },
        });
        await Promise.all([findComment, findUser, checkUserLikedComment]).then(async (data) => {
          if (data[2].length > 0) {
            await Promise.all([
              Comment.findByIdAndUpdate(commentId, {
                $pull: {
                  likes: accountId,
                },
              }),
              HistoryLike.deleteOne({
                account: session.user.account,
                comment: { $in: [commentId] },
              }),
            ]).then((data) => {
              return res.status(200).json({
                status: "success",
                message: "unlike",
              });
            });
          } else {
            await Promise.all([
              Comment.findByIdAndUpdate(commentId, {
                $push: {
                  likes: accountId,
                },
              }),
              HistoryLike.create({
                account: session.user.account,
                comment: [commentId],
              }),
            ]).then((data) => {
              return res.status(200).json({
                status: "success",
                message: "like",
              });
            });
          }
        });
      } catch (err) {
        return catchError(err, res);
      }
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Đăng nhập để Like comment",
      });
    }
  }
};
export default handle;
