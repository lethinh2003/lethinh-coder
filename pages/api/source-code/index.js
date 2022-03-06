import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
import axios from "axios";

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "https://www.lethinh-coder.site",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const handle = async (req, res) => {
  const session = await getSession({ req });
  await cors(req, res);
  await dbConnect();
  if (req.method === "GET") {
    console.log("QUERY", req.query);

    let results = Code.find({}).select("-link -__v");
    if (req.query.sort) {
      const arraySort = req.query.sort.split(",").join(" ");
      results = results.sort(arraySort);
    }
    const data = await results;

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } else if (req.method === "POST") {
    if (session && session.user) {
      if (session.user.role === "user") {
        return res.status(400).json({
          status: "fail",
          message: "You can't access this router",
        });
      } else {
        const { title, content, link, costs, images, desc } = req.body;
        try {
          const result = await Code.create({
            title: title,
            content: content,
            link: link,
            costs: costs,
            images: images,
            desc: desc,
          });
          return res.status(201).json({
            status: "success",
            message: "Tạo thành công",
          });
        } catch (err) {
          return catchError(err, res);
        }
      }
    }
  }
};
export default handle;
