import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
import rateLimit from "../../../lib/rate-limit";

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
    await cors(req, res);
    await dbConnect();
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute
    const session = await getSession({ req });

    if (req.method === "POST") {
      if (!session || !session.user) {
        const { account, password, confirmPassword } = req.body;
        const result = await User.create({
          account: account,
          password: password,
          confirmPassword: confirmPassword,
        });
        return res.status(201).json({
          status: "success",
          message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Vui lòng đăng xuất tài khoản hiện tại để đăng ký tài khoản khác",
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
