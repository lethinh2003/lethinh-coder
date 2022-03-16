import dbConnect from "../../../../database/dbConnect";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import Comment from "../../../../models/Comment";
import HistoryLike from "../../../../models/HistoryLike";
import RepComment from "../../../../models/RepComment";

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
    if (req.method === "POST") {
      const { commentId, userId } = req.body;
      if (session && session.user && session.user.id === userId) {
        const deleteComment = Comment.findByIdAndDelete(commentId);
        const deleteLike = HistoryLike.deleteMany({
          comment: { $in: [commentId] },
        });
        const deleteReply = RepComment.deleteMany({
          comment: { $in: [commentId] },
        });
        await Promise.all([deleteComment, deleteLike, deleteReply]);
        return res.status(204).end();
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Đăng nhập để xoá comment",
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
