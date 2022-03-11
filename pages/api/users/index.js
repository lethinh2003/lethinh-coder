import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import Notify from "../../../models/Notify";
import Comment from "../../../models/Comment";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
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
      if (req.query.account !== session.user.account) {
        throw new Error("You do not permit");
      }
      let results = User.find({
        account: req.query.account,
      }).select("-link -__v -password");
      const data = await results;
      const getNotifies = await Notify.find({
        account_receive: { $in: [session.user.id] },
      })
        .sort("-_id")
        .select("-__v")
        .populate({
          path: "account_receive",
          select: "-__v -password",
        })
        .populate({
          path: "account_send",
          select: "-__v -password",
        });
      const getComments = await Comment.find({
        user: { $in: [session.user.id] },
      })
        .select("-__v")
        .populate({
          path: "user",
          select: "-__v -password",
        })
        .populate({
          path: "reply",
          select: "-__v -password",
        });
      console.log(getNotifies);
      return res.status(200).json({
        status: "success",
        data: [
          {
            userInfo: data,
            userNotifies: getNotifies,
            userComments: getComments,
          },
        ],
      });
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
