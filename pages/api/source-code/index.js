import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
const cors = initMiddleware(
  Cors({
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
  })
);

const handle = async (req, res) => {
  try {
    const session = await getSession({ req });
    await cors(req, res);
    await dbConnect();
    if (req.method === "GET") {
      let results = Code.find({}).select("-link -__v");
      if (req.query.sort) {
        const arraySort = req.query.sort.split(",").join(" ");

        results = results.sort(arraySort);
      }
      if (req.query.label) {
        const labels = req.query.label;
        results = results.find({
          labels: { $in: [labels] },
        });
      }
      const data = await results;
      return res.status(200).json({
        status: "success",
        data: data,
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
