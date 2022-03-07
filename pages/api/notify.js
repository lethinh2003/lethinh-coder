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
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "https://www.lethinh-coder.site",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const handle = async (req, res) => {
  const session = await getSession({ req });
  // await cors(req, res);
  await dbConnect();
  if (session && session.user) {
    if (req.method === "GET") {
      const findNotifies = await Notify.find({
        account_receive: session.user.account,
      }).sort("-_id");
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
    }
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Đăng nhập để tải xuống code",
    });
  }
};
export default handle;
