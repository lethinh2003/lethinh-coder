import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";
export const getMostDownload = async () => {
  const results = await axios.get("/api/source-code/most-download");
  console.log(results);
  return results;
};

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    const results = await Code.find({}).sort("-downloads").limit(4).select("-link -__v");
    return res.status(200).json({
      status: "success",
      data: results,
    });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "You can't access this router",
    });
  }
};
export default handle;
