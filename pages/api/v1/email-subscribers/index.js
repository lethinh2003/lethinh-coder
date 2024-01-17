import Cors from "cors";
import CryptoJS from "crypto-js";
import mongoose from "mongoose";
import validator from "validator";
import dbConnect from "../../../../database/dbConnect";
import initMiddleware from "../../../../lib/init-middleware";
import EmailSubscriberRepository from "../../../../models/repositories/EmailSubscriberRepository";
import EmailService from "../../../../services/server/EmailService";
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
      const { email } = req.body;
      const path = process.env.NEXTAUTH_URL;
      if (!validator.isEmail(email)) {
        return new BadRequestError("Email không hợp lệ").send(res);
      }
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        try {
          // generate token
          const token = CryptoJS.SHA256(email).toString();
          // find email, if doesn't exist then create itself
          const createEmailNotify = await EmailSubscriberRepository.findOneAndUpdate({
            query: {
              email: email,
            },
            update: {
              $set: {
                email: email,
                token: token,
              },
            },
            options: {
              new: false,
              upsert: true,
              session,
            },
          });

          if (createEmailNotify) {
            throw new BadRequestError("Email đã tồn tại");
          } else {
            // send email to subscriber
            await EmailService.sendEmailSubcriber({ email, token });

            await session.commitTransaction();
            return new OkResponse({
              message: "Đăng ký nhận tin thành công!",
              metadata: {
                ...req.body,
              },
            }).send(res);
          }
        } catch (err) {
          await session.abortTransaction();
          throw err;
        } finally {
          await session.endSession();
        }
      });
    } else {
      return new NotFoundError("Something went wrong").send(res);
    }
  } catch (err) {
    console.log(err);
    return catchError(err, res);
  }
};
export default handle;
