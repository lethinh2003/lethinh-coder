import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Randomstring from "randomstring";
import UserRepository from "../../models/repositories/UserRepository";
import { BadRequestError } from "../../utils/appError";
import EmailService from "./EmailService";

class UserService {
  static findDetailedUser = async ({ query, select, options }) => {
    const getUser = await UserRepository.findOne({
      query,
      select,
    });
    if (!getUser) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    return getUser;
  };
  static loginAccount = async ({ account, password }) => {
    const getUser = await UserRepository.findOne({
      query: {
        account,
      },
    });
    if (!getUser) {
      throw new BadRequestError("Tài khoản không tồn tại");
    }
    const isAuthPassword = await bcrypt.compare(password, getUser.password);
    if (!isAuthPassword) {
      throw new BadRequestError("Mật khẩu không chính xác");
    }
    return getUser;
  };

  static loginWithGoogleAccount = async ({ email, avatar, name }) => {
    // Check user already existed
    const getUser = await UserRepository.findOne({
      query: {
        account: email,
      },
    });
    // Create new user and send account to email
    if (!getUser) {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        try {
          const generatePassword = Randomstring.generate({
            length: 10,
            charset: "alphabetic",
          });
          const newUser = await UserRepository.createOne({
            data: {
              account: email,
              password: generatePassword,
              confirmPassword: generatePassword,
              avatar,
              name,
            },
            options: {
              session,
            },
          });
          const sendEmail = await EmailService.sendEmailRegisterAccountWithGoogle({
            email,
            password: generatePassword,
          });

          await session.commitTransaction();
          return newUser;
        } catch (err) {
          await session.abortTransaction();
          throw err;
        } finally {
          await session.endSession();
        }
      });
    }
    return getUser;
  };
}
export default UserService;
