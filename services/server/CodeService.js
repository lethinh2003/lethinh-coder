import mongoose from "mongoose";
import CodeRepository from "../../models/repositories/CodeRepository";
import HistoryCodeRepository from "../../models/repositories/HistoryCodeRepository";
import { BadRequestError } from "../../utils/appError";
import EmailService from "./EmailService";

class CodeService {
  static findCodes = async ({ query = {}, sort = { createdAt: -1 }, itemsOfPage = 10, page = 1, select, options }) => {
    const limitItems = itemsOfPage * 1;
    const pageItem = page * 1;
    const skipItems = (pageItem - 1) * limitItems;
    const data = await CodeRepository.find({
      query,
      limit: limitItems,
      skip: skipItems,
      select,
      sort,
      options,
    });
    return { limitItems, pageItem, data };
  };
  static findDetailedCode = async ({ query = {}, select, options }) => {
    const data = await CodeRepository.findOne({
      query,
      select,
      options,
    });
    return data;
  };
  static downloadCode = async ({ codeId, email, account }) => {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      try {
        const findCode = await CodeRepository.findOne({
          query: {
            status: true,
            _id: codeId,
          },
        });
        if (!findCode) {
          throw new BadRequestError("Code không tồn tại");
        }
        // Check history download code
        const historyDownload = await HistoryCodeRepository.findOneAndUpdate({
          query: {
            code: codeId,
            account,
          },
          update: {
            content: `Download code "${findCode.title}" thành công`,
            status: "success",
            email: email,
          },
          options: {
            new: false,
            upsert: true,
            session,
          },
        });
        if (historyDownload) {
          throw new BadRequestError("Bạn đã download code này! ");
        }

        const updateDownloadCounts = CodeRepository.findOneAndUpdate({
          query: {
            _id: findCode._id,
          },
          update: { $inc: { downloads: 1 } },
          options: {
            session,
          },
        });

        const sendMailDownload = EmailService.sendEmailDownloadCode({ email, sourceCode: findCode });
        // update download count and send download information to email
        await Promise.all([updateDownloadCounts, sendMailDownload]);

        await session.commitTransaction();
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    });
  };
}
export default CodeService;
