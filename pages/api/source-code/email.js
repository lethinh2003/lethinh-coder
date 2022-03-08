import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
import sendEmail from "../../../utils/email";
import HistoryCode from "../../../models/HistoryCode";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
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
    if (req.method === "POST") {
      const { email, codeId } = req.body;
      try {
        const findHistory = await HistoryCode.find({
          code: codeId,
          account: session.user.account,
        });
        if (findHistory && findHistory.length > 0) {
          return res.status(400).json({
            status: "fail",
            message: "Bạn đã download code này rồi",
          });
        }
        const findCode = await Code.find({
          _id: codeId,
        });

        const message = `

        <div style=" width: 500px; padding: 10px;">
   
          <a href=${req.headers.host}><img src="https://i.imgur.com/U0BdIic.png" style="width: 40px; height: 40px" alt="LT-Blog"></a>
          <span>Hi there,</span>
          <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web của tôi. Sau đây là thông tin download của bạn: </p>
          <li >Tên code: ${findCode[0].title}</li>
          <li >Giá: ${findCode[0].costs} VNĐ</li>
          <li >Link tải: ${findCode[0].link}</li>
          <li >Xem chi tiết code: <a href=${req.headers.referer}>Tại đây</a></li>

          <p style="font-weight:500">Thông tin liên hệ</p>
          <li>Website:  <a href=${req.headers.host}>${req.headers.host} </a> </li>
          <li>Zalo: <a href="https://zalo.me/lethinhpro123">Thinh Lee</a></li>
          <li>Facebook: <a href="https://www.facebook.com/thinhvle2210/">Van Thinh Le</a></li>

          <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
     
      </div>  `;

        const historyMessage = `Download code ${findCode[0].title} với giá ${findCode[0].costs} VNĐ`;
        if (findCode[0].costs === 0) {
          const sendMail = sendEmail({
            email: email,
            subject: "[No Reply] Download code thành công tại LT Blog",
            message,
          });
          const saveToDB = HistoryCode.create({
            email: email,
            code: codeId,
            content: historyMessage,
            account: session.user.account,
            status: "success",
          });
          const incViews = Code.updateOne(
            {
              _id: codeId,
            },
            { $inc: { downloads: 1 } },
            {
              new: true,
            }
          );
          await Promise.all([sendMail, saveToDB, incViews]).then((data) => {
            return res.status(200).json({
              status: "success",
              message: "Tải xuống code thành công, vui lòng kiểm tra mail (bao gồm spam, thùng rác,..)",
            });
          });
        } else {
          const saveToDB = await HistoryCode.create({
            email: email,
            code: codeId,
            content: historyMessage,
            account: session.user.account,
            status: "pending",
          });
          return res.status(200).json({
            status: "success",
            message: "Yêu cầu tải xuống của bạn đang được duyệt. Sau khi duyệt xong, bạn sẽ nhận được email tải xuống!",
          });
        }
      } catch (err) {
        console.log(err);
        return catchError(err, res);
      }
    }
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Đăng nhập để tải xuống code",
    });
  }
};
export default handle;
