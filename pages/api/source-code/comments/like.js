import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
import RepComment from "../../../../models/RepComment";
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

        const findComment = await Comment.find({
          _id: commentId,
        })
          .populate({
            path: "user",
            select: "-__v -password",
          })
          .populate({
            path: "reply",
            select: "-__v -password",
          });
        const checkUserLikedComment = await Comment.find({
          _id: commentId,
          likes: { $in: [accountId] },
        });
        if (checkUserLikedComment.length > 0) {
          await Comment.findByIdAndUpdate(commentId, {
            $pull: {
              likes: accountId,
            },
          });
          await HistoryLike.deleteOne({
            account: session.user.account,
            comment: { $in: [commentId] },
          });
          return res.status(200).json({
            status: "success",
            message: "unlike",
          });
        } else {
          if (session.user.account !== findComment[0].user[0].account) {
            await Comment.findByIdAndUpdate(commentId, {
              $push: {
                likes: accountId,
              },
            });
            await HistoryLike.create({
              account: session.user.account,
              comment: [commentId],
            });
            await Notify.create({
              link: linkNotify,
              account_send: [session.user.id],
              account_receive: [findComment[0].user[0]._id],
              content: `${session.user.account} vừa like comment: "${findComment[0].content}" của bạn.`,
            });
          } else {
            await Comment.findByIdAndUpdate(commentId, {
              $push: {
                likes: accountId,
              },
            });
            await HistoryLike.create({
              account: session.user.account,
              comment: [commentId],
            });
          }
          return res.status(200).json({
            status: "success",
            message: "like",
          });
        }
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
    console.log(err);
    return catchError(err, res);
  }
};
export default handle;
