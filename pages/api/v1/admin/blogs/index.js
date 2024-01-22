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
    methods: ["GET", "POST"],
  })
);
const handle = async (req, res) => {
  await cors(req, res);

  await dbConnect();
  if (req.method === "GET") {
    return new OkResponse({
      data: await AdminService.getBlogs(),
    }).send(res);
  } else if (req.method === "POST") {
    const { title, content, images, status, desc, labels, keywords } = req.body;

    if (!title || !content || !images || !desc || !labels || !keywords) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const result = await AdminService.createNewBlog({
      title,
      content,
      images,
      status,
      desc,
      labels,
      keywords,
    });

    return new OkResponse({
      message: "Tạo blog thành công",
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(authMiddleware(handle, "admin"));
