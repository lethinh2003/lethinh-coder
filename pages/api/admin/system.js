import dbConnect from "../../../database/dbConnect";
import catchError from "../../../utils/catchError";
import System from "../../../models/System";

import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (session && session.user.role === "admin") {
    if (req.method === "GET") {
      const resp = await System.find({});
      return res.status(200).json({
        status: "success",
        data: resp,
      });
    } else if (req.method === "POST") {
      const resp = await System.create(req.body);
      return res.status(200).json({
        status: "success",
        message: "Thanh cong",
      });
    }
  } else {
    return res.status(404).json({
      status: "fail",
      message: "Đăng nhập để sử dụng api này",
    });
  }
};
export default handle;
