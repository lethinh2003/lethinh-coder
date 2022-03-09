import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
import User from "../../../../models/User";
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
        const { commentId, content, linkNotify } = req.body;

        const findComment = Comment.find({
          _id: commentId,
        });

        const findUser = User.find({
          account: session.user.account,
        });

        await Promise.all([findComment, findUser]).then(async (data) => {
          if (session.user.account === data[0][0].account) {
            await Promise.all([
              Comment.findByIdAndUpdate(commentId, {
                $push: {
                  reply: {
                    account: session.user.account,
                    content: content,
                    role: session.user.role,
                  },
                },
              }),
            ]).then((data) => {
              return res.status(200).json({
                status: "success",
                message: "Thanh cong",
              });
            });
          } else {
            await Promise.all([
              Comment.findByIdAndUpdate(commentId, {
                $push: {
                  reply: {
                    account: session.user.account,
                    content: content,
                    role: session.user.role,
                  },
                },
              }),
              Notify.create({
                link: linkNotify,
                account_send: session.user.account,
                account_receive: data[0][0].account,
                content: `${session.user.account} vừa reply: "${content}" tại comment: "${data[0][0].content}" của bạn.`,
              }),
            ]).then((data) => {
              return res.status(200).json({
                status: "success",
                message: "Thanh cong",
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Đăng nhập để Reply comment",
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
