import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import sendEmail from "../../../utils/email";
import HistoryCode from "../../../models/HistoryCode";
import System from "../../../models/System";
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
    const session = await getSession({ req });
    await cors(req, res);
    await limiter.check(res, 20, "CACHE_TOKEN"); // 20 requests per minute

    await dbConnect();
    if (req.method === "POST") {
      if (session && session.user) {
        const { email, codeId } = req.body;

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
        const findSystem = await System.find({});

        const message = `

        <div style=" width: 500px; padding: 10px;">
   
          <a href=${req.headers.host}><img src=${findSystem[0].home_logo} style="width: 40px; height: 40px" alt="Home Logo"></a>
          <span>Hi there,</span>
          <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web của tôi. Sau đây là thông tin download của bạn: </p>
          <li >Tên code: ${findCode[0].title}</li>
          <li >Giá: ${findCode[0].costs} VNĐ</li>
          <li >Link tải: ${findCode[0].link}</li>
          <li >Xem chi tiết code: <a href=${req.headers.referer}>Tại đây</a></li>

          <p style="font-weight:500">Thông tin liên hệ</p>
          <li>Website:  <a href=${req.headers.host}>${req.headers.host} </a> </li>
          <li>Zalo: <a href=${findSystem[0].myself_zalo}>${findSystem[0].myself_zalo_name}</a></li>
          <li>Facebook: <a href=${findSystem[0].myself_fb}>${findSystem[0].myself_fb_name}</a></li>
          <li>Email: ${findSystem[0].myself_email}</li>
          <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
     
      </div>  `;

        const historyMessage = `Download code ${findCode[0].title} với giá ${findCode[0].costs} VNĐ`;
        if (findCode[0].costs === 0) {
          const sendMail = sendEmail({
            email: email,
            subject: "[No Reply] Download code thành công",
            message,
          });
          const saveToDB = HistoryCode.create({
            email: email,
            code: codeId,
            content: historyMessage,
            account: session.user.account,
            status: "success",
          });
          const incDownloads = Code.updateOne(
            {
              _id: codeId,
            },
            { $inc: { downloads: 1 } },
            {
              new: true,
            }
          );
          await Promise.all([sendMail, saveToDB, incDownloads]).then((data) => {
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
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Đăng nhập để tải xuống code",
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
