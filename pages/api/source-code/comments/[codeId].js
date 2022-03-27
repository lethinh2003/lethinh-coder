import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
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
    const { codeId } = req.query;
    await cors(req, res);
    await dbConnect();
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
    if (req.method === "GET") {
      const results = await Comment.find({
        code: { $in: [codeId] },
      })
        .populate({
          path: "user",
          select: "-__v -password",
        })
        .populate({
          path: "reply",
          select: "-__v -password",
        })
        .populate({
          path: "code",
          select: "-__v -link",
        })

        .sort("-_id")
        .select("-__v");
      return res.status(200).json({
        status: "success",
        data: results,
      });
    } else if (req.method === "POST") {
      if (session && session.user) {
        const { content } = req.body;
        const saveToDB = await Comment.create({
          user: [session.user.id],
          code: [codeId],
          content: content,
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
    console.log(err);
    return catchError(err, res);
  }
};
export default handle;
