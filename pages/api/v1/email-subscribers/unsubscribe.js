import Cors from "cors";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import EmailSubscriberRepository from "../../../../models/repositories/EmailSubscriberRepository";
import { BadRequestError, NotFoundError } from "../../../../utils/appError";
import catchError from "../../../../utils/catchError";
import { OkResponse } from "../../../../utils/successResponse";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);

const handle = async (req, res) => {
  try {
    await cors(req, res);
    await dbConnect();
    if (req.method === "POST") {
      const { token } = req.body;

      const findEmailSubscriber = await EmailSubscriberRepository.findOne({
        query: {
          token,
        },
      });
      if (!findEmailSubscriber) {
        return new BadRequestError("Email chưa đăng ký nhận thông báo").send(res);
      }
      // Remove email subscriber
      await EmailSubscriberRepository.findOneAndDelete({
        query: {
          token,
        },
      });

      return new OkResponse({
        message: "Hủy đăng ký nhận tin thành công!",
        metadata: {
          ...req.body,
        },
      }).send(res);
    } else {
      return new NotFoundError("Something went wrong").send(res);
    }
  } catch (err) {
    console.log(err);
    return catchError(err, res);
  }
};
export default handle;
