import dbConnect from "../../database/dbConnect";

import System from "../../models/System";

import { getSession } from "next-auth/react";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    const resp = await System.find({}).select("-v");
    return res.status(200).json({
      status: "success",
      data: resp,
    });
  }
};
export default handle;
