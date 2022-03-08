import dbConnect from "../../../database/dbConnect";
import HistoryCode from "../../../models/HistoryCode";
import catchError from "../../../utils/catchError";
import Code from "../../../models/Code";
import User from "../../../models/User";
import Comment from "../../../models/Comment";
import Notify from "../../../models/Notify";
import HistoryLike from "../../../models/HistoryLike";

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
      const getUsers = User.find({ status: "active" }).select("-__v -password");
      const getNotifies = Notify.find().select("-__v");
      const getComments = Comment.find().select("-__v");
      const getLikes = HistoryLike.find().select("-__v");

      await Promise.all([
        getOrders,
        getOrdersSuccess,
        getOrdersPending,
        getSourcesCode,
        getUsers,
        getNotifies,
        getComments,
        getLikes,
      ]).then((data) => {
        return res.status(200).json({
          status: "success",
          data: [
            { key: "orders", title: "Đơn Hàng", value: data[0].length },
            { key: "ordersSuccess", title: "Thành Công", value: data[1].length },
            { key: "ordersPending", title: "Đang Xử Lý", value: data[2].length },
            { key: "sourcesCode", title: "Source Code", value: data[3].length },
            { key: "users", title: "Người Dùng", value: data[4].length },
            { key: "notifies", title: "Thông Báo", value: data[5].length },
            { key: "comments", title: "Comments", value: data[6].length },
            { key: "likes", title: "Likes", value: data[7].length },
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
