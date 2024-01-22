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
      throw new UnauthorizedError("Vui lòng nhập id blog");
    }

    return new OkResponse({
      data: await AdminService.getDetailedBlog({
        blogId: id,
      }),
    }).send(res);
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { title, content, images, status, desc, labels, keywords } = req.body;
    if (!id) {
      throw new UnauthorizedError("Vui lòng nhập id blog");
    }
    if (!title || !content || !images || !desc || !labels || !keywords) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const result = await AdminService.updateDetailedBlog({
      blogId: id,
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
      throw new UnauthorizedError("Vui lòng nhập id blog");
    }
    const result = await AdminService.deleteBlog({
      blogId: id,
    });

    return new OkResponse({
      message: "Xóa blog thành công",
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(authMiddleware(handle, "admin"));
