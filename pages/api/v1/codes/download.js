import Cors from "cors";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import CodeService from "../../../../services/server/CodeService";
import { NotFoundError, UnauthorizedError } from "../../../../utils/appError";
import catchError from "../../../../utils/catchError";
import { OkResponse } from "../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["POST"],
  })
);

const handle = async (req, res) => {
  try {
    await cors(req, res);
    await dbConnect();
    if (req.method === "POST") {
      const session = await getSession({ req });

      if (!session) {
        return new UnauthorizedError("Vui lòng đăng nhập tài khoản").send(res);
      }

      const { codeId, email } = req.body;
      if (!codeId || !email) {
        return new UnauthorizedError("Code không tồn tại hoặc chưa điền đủ thông tin").send(res);
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
      return new NotFoundError("Something went wrong").send(res);
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
