import dbConnect from "../../../database/dbConnect";
import catchError from "../../../utils/catchError";
import User from "../../../models/User";

import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    if (session && session.user.role === "admin") {
      const getUsers = await User.find({}).select("-__v -password");
      return res.status(200).json({
        status: "success",
        data: getUsers,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Đăng nhập để sử dụng api này",
      });
    }
  }
};
export default handle;
