import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import catchError from "../../../utils/catchError";

const handle = async (req, res) => {
  await dbConnect();
  if (req.method === "POST") {
    const { account, password, confirmPassword } = req.body;
    try {
      const result = await User.create({
        account: account,
        password: password,
        confirmPassword: confirmPassword,
      });
      return res.status(201).json({
        status: "success",
        message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập",
      });
    } catch (err) {
      return catchError(err, res);
    }
  }
};
export default handle;
