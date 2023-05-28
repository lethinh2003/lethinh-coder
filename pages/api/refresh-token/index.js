import Cors from "cors";
import dbConnect from "../../../database/dbConnect";
import initMiddleware from "../../../lib/init-middleware";
import User from "../../../models/User";
import catchError from "../../../utils/catchError";
var jwt = require("jsonwebtoken");
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
      const { refreshToken } = req.body;
      const decodeRefreshToken = jwt.verify(refreshToken, process.env.NEXTAUTH_SECRET);
      const user = await User.findOne({ refreshToken });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Refresh token không tồn tại",
        });
      }
      const generateAccessToken = jwt.sign(
        { account: user.account, role: user.role, id: user._id },
        process.env.NEXTAUTH_SECRET,
        {
          expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRED,
        }
      );
      const generateRefreshToken = jwt.sign(
        { account: user.account, role: user.role, id: user._id },
        process.env.NEXTAUTH_SECRET,
        {
          expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRED,
        }
      );
      const expireAccessToken = Math.round(Date.now() + parseInt(process.env.JWT_ACCESSTOKEN_EXPIRED));

      // update Refresh Token
      await User.findOneAndUpdate(
        {
          refreshToken,
        },
        {
          refreshToken: generateRefreshToken,
        }
      );

      return res.status(200).json({
        status: "success",
        accessToken: generateAccessToken,
        refreshToken: generateRefreshToken,
        expireAccessToken: expireAccessToken,
      });
    }
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      const { refreshToken } = req.body;
      const user = await User.findOneAndUpdate(
        { refreshToken },
        {
          refreshToken: null,
        }
      );
    }
    return catchError(err, res);
  }
};
export default handle;
