import dbConnect from "../../database/dbConnect";
import Code from "../../models/Code";
import catchError from "../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
import sendEmail from "../../utils/email";
import Notify from "../../models/Notify";
import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";
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

    if (session && session.user) {
      if (req.method === "GET") {
        const findNotifies = await Notify.find({
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
        return res.status(200).json({
          status: "success",
          data: findNotifies,
        });
      } else if (req.method === "POST") {
        const { notifyId } = req.body;
        const findNotifies = await Notify.findByIdAndDelete(notifyId);
        return res.status(204).end();
      } else {
        return res.status(404).json({
          status: "error",
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Đăng nhập để xem thông báo",
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
