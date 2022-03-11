import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
import RepComment from "../../../../models/RepComment";
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
const checkValid = (arr, value) => {
  let check = false;
  arr.filter((item) => {
    if (item.account === value) {
      check = true;
    }
  });
  return check;
};

const handle = async (req, res) => {
  try {
    const session = await getSession({ req });
    await cors(req, res);
    await dbConnect();
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
    if (req.method === "POST") {
      if (session && session.user) {
        const { commentId, content, linkNotify } = req.body;
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
        if (session.user.account === findComment[0].user[0].account) {
          const createReplyComment = await RepComment.create({
            user: [session.user.id],
            content: content,
          });
          const updateComment = await Comment.findByIdAndUpdate(commentId, {
            $push: {
              reply: createReplyComment._id,
            },
          });
          return res.status(200).json({
            status: "success",
            message: "Thanh cong",
          });
        } else {
          const createReplyComment = await RepComment.create({
            user: [session.user.id],
            content: content,
          });
          const updateComment = await Comment.findByIdAndUpdate(commentId, {
            $push: {
              reply: createReplyComment._id,
            },
          });
          const sendNotify = await Notify.create({
            link: linkNotify,
            account_send: [session.user.id],
            account_receive: [findComment[0].user[0]._id],
            content: `${session.user.account} vừa reply: "${content}" tại comment: "${findComment[0].content}" của bạn.`,
          });
          let listSendNotifies = [];
          let listArrayCheck = [];

          const loopSendNotifies = findComment[0].reply.map((item) => {
            if (!checkValid(listArrayCheck, item.user[0].account)) {
              const newNotify = Notify.create({
                link: linkNotify,
                account_send: [session.user.id],
                account_receive: [item.user[0]._id],
                content: `${session.user.account} vừa reply: "${content}" tại comment: "${findComment[0].content}" của ${findComment[0].user[0].account}.`,
              });

              listSendNotifies.push(newNotify);
              listArrayCheck.push({
                account: item.user[0].account,
              });
            }
          });

          await Promise.all(listSendNotifies).then((data) => {
            console.log("success");
          });
          return res.status(200).json({
            status: "success",
            message: "Thanh cong",
          });
        }
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
    console.log(err);
    return catchError(err, res);
  }
};
export default handle;
