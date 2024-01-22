import Cors from "cors";
import dbConnect from "../../../../../database/dbConnect";
import authMiddleware from "../../../../../lib/auth-middleware";
import initMiddleware from "../../../../../lib/init-middleware";
import catchAsync from "../../../../../lib/trycatch-middleware";
import AdminService from "../../../../../services/server/AdminService";
import { NotFoundError, UnauthorizedError } from "../../../../../utils/appError";
import { OkResponse } from "../../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST", "DELETE"],
  })
);
const handle = async (req, res) => {
  await cors(req, res);

  await dbConnect();
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      throw new UnauthorizedError("Vui lòng nhập id code");
    }

    return new OkResponse({
      data: await AdminService.getDetailedCode({
        codeId: id,
      }),
    }).send(res);
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { link, costs, title, content, images, status, desc, labels, keywords } = req.body;
    if (!id) {
      throw new UnauthorizedError("Vui lòng nhập id code");
    }
    if (!link || !title || !content || !images || !desc || !labels || !keywords) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const result = await AdminService.updateDetailedCode({
      codeId: id,
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

    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      throw new UnauthorizedError("Vui lòng nhập id code");
    }
    const result = await AdminService.deleteCode({
      codeId: id,
    });

    return new OkResponse({
      message: "Xóa code thành công",
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(authMiddleware(handle, "admin"));
