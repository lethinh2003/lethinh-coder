import dbConnect from "../../../database/dbConnect";
import HistoryCode from "../../../models/HistoryCode";
import catchError from "../../../utils/catchError";
import Code from "../../../models/Code";
import User from "../../../models/User";

import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    if (session && session.user.role === "admin") {
      const getOrders = HistoryCode.find({}).select("-__v");
      const getOrdersSuccess = HistoryCode.find({ status: "success" }).select("-__v");
      const getOrdersPending = HistoryCode.find({ status: "pending" }).select("-__v");
      const getSourcesCode = Code.find({ status: true }).select("-__v -link");
      const getUsers = User.find({ status: true }).select("-__v -password");

      await Promise.all([getOrders, getOrdersSuccess, getSourcesCode, getUsers]).then((data) => {
        return res.status(200).json({
          status: "success",
          data: [
            { key: "orders", title: "Đơn Hàng", value: data[0].length },
            { key: "ordersSuccess", title: "Thành Công", value: data[1].length },
            { key: "sourcesCode", title: "Source Code", value: data[2].length },
            { key: "users", title: "Người Dùng HĐ", value: data[3].length },
          ],
        });
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
