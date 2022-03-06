import dbConnect from "../../../database/dbConnect";
import User from "../../../models/User";
import catchError from "../../../utils/catchError";

const handle = async (req, res) => {
  await dbConnect();

  if (req.method === "GET") {
    return res.status(200).json({
      status: "success",
      message: "Get",
    });
  } else if (req.method === "POST") {
    const { account, password, confirmPassword } = req.body;
    try {
      const result = await User.create({
        account: account,
        password: password,
        confirmPassword: confirmPassword,
      });
      return res.status(201).json({
        status: "success",
        message: "Thanh cong",
      });
    } catch (err) {
      catchError(err, res);
      return res.status(400).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};
export default handle;
