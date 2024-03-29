import Cors from "cors";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../database/dbConnect";
import { protectedMiddleware } from "../../../../lib/auth-middleware";
import initMiddleware from "../../../../lib/init-middleware";
import catchAsync from "../../../../lib/trycatch-middleware";
import CodeService from "../../../../services/server/CodeService";
import { NotFoundError, UnauthorizedError } from "../../../../utils/appError";
import { OkResponse } from "../../../../utils/successResponse";
import { authOptions } from "../../auth/[...nextauth]";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["POST"],
  })
);

const handle = async (req, res) => {
  await cors(req, res);
  await dbConnect();
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    const { codeId, email } = req.body;
    if (!codeId || !email) {
      throw new UnauthorizedError("Code không tồn tại hoặc chưa điền đủ thông tin");
    }
    await CodeService.downloadCode({ codeId, email, account: session.user.account });

    return new OkResponse({
      message: "Thông tin download code đã được gửi đến email",
      metadata: {
        ...req.body,
        account: session.user.account,
      },
    }).send(res);
  } else {
    throw new NotFoundError("Something went wrong");
  }
};
export default catchAsync(protectedMiddleware(handle));
