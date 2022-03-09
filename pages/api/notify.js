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
          account_receive: session.user.account,
        })
          .sort("-_id")
          .select("-__v");
        return res.status(200).json({
          status: "success",
          data: findNotifies,
        });
      }
      if (req.method === "POST") {
        const findNotifies = await Notify.updateMany(
          {
            account_receive: session.user.account,
          },
          { status: true }
        );
        return res.status(200).json({
          status: "success",
          data: findNotifies,
        });
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
