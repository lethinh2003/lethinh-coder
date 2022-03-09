import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
const handle = async (req, res) => {
  try {
    await dbConnect();
    if (req.method === "GET") {
      const { keyword } = req.query;
      const results = await Code.find({ labels: { $in: [keyword] } })
        .limit(4)
        .sort("-_id")
        .select("-link -__v");
      return res.status(200).json({
        status: "success",
        data: results,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Something went error",
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};
export default handle;
