import Cors from "cors";
import uploadCloud from "../../../../configs/cloudinary";
import authMiddleware from "../../../../lib/auth-middleware";
import initMiddleware from "../../../../lib/init-middleware";
import catchAsync from "../../../../lib/trycatch-middleware";
import { BadRequestError } from "../../../../utils/appError";
import { OkResponse } from "../../../../utils/successResponse";
export const config = {
  api: { bodyParser: false },
};
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["POST"],
  })
);

const handle = async (req, res) => {
  await cors(req, res);
  uploadCloud.single("file")(req, res, () => {
    if (!req.file) {
      throw new BadRequestError("Có lỗi khi upload file");
    }
    return new OkResponse({
      data: req.file.path,
    }).send(res);
  });
};
export default catchAsync(authMiddleware(handle, "admin"));
