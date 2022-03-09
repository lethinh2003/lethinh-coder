import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
import User from "../../../../models/User";
import HistoryLike from "../../../../models/HistoryLike";
import Notify from "../../../../models/Notify";
import initMiddleware from "../../../../lib/init-middleware";
import Cors from "cors";
import rateLimit from "../../../../lib/rate-limit";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 20, // Max 20 users per second
});

const handle = async (req, res) => {
  try {
    const session = await getSession({ req });
    await cors(req, res);
    await dbConnect();
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
    if (req.method === "POST") {
      if (session && session.user) {
        const { commentId, accountId, linkNotify } = req.body;

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
            if (session.user.account !== data[0][0].account) {
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
                Notify.create({
                  link: linkNotify,
                  account_send: session.user.account,
                  account_receive: data[0][0].account,
                  content: `${session.user.account} vừa like comment: "${data[0][0].content}" của bạn.`,
                }),
              ]).then((data) => {
                return res.status(200).json({
                  status: "success",
                  message: "like",
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
          }
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Đăng nhập để Like comment",
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
