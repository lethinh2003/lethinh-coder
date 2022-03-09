import dbConnect from "../../database/dbConnect";
import System from "../../models/System";
import Cors from "cors";
import initMiddleware from "../../lib/init-middleware";
import catchError from "../../utils/catchError";

const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);

const handle = async (req, res) => {
  try {
    await dbConnect();
    await cors(req, res);

    if (req.method === "GET") {
      const resp = await System.find({}).select("-v");
      return res.status(200).json({
        status: "success",
        data: resp,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
