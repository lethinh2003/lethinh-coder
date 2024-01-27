import Cors from "cors";
import dbConnect from "../../../../../database/dbConnect";
import authMiddleware from "../../../../../lib/auth-middleware";
import initMiddleware from "../../../../../lib/init-middleware";
import catchAsync from "../../../../../lib/trycatch-middleware";
import AdminService from "../../../../../services/server/AdminService";
import EmailService from "../../../../../services/server/EmailService";
import { NotFoundError, UnauthorizedError } from "../../../../../utils/appError";
import { OkResponse } from "../../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);
const handle = async (req, res) => {
  await cors(req, res);

  await dbConnect();
  if (req.method === "GET") {
    return new OkResponse({
      data: await AdminService.getCodes(),
    }).send(res);
  } else if (req.method === "POST") {
    const { title, link, costs, content, images, status, desc, labels, keywords } = req.body;

    if (!title || !link || !content || !images || !desc || !labels || !keywords) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const result = await AdminService.createNewCode({
      link,
      costs,
      title,
      content,
      images,
      status,
      desc,
      labels,
      keywords,
    });

    EmailService.sendEmailNewCodeToSubcriber({ code: result }).catch((err) => {
      console.log("Lỗi send mail thông báo code mới: ", err);
    });

    return new OkResponse({
      message: "Tạo code thành công",
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(authMiddleware(handle, "admin"));
