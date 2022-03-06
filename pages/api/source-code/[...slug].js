import dbConnect from "../../../database/dbConnect";
import Code from "../../../models/Code";
import catchError from "../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    const test = req.query.slug.join("/");
    const results = await Code.find({
      slug: test,
    });

    return res.status(200).json({
      status: "success",
      data: results,
    });
  } else if (req.method === "POST") {
    if (session && session.user) {
      if (session.user.role === "user") {
        return res.status(400).json({
          status: "fail",
          message: "You can't access this router",
        });
      } else {
        const { title, content, link, costs, images } = req.body;
        try {
          const result = await Code.create({
            title: title,
            content: content,
            link: link,
            costs: costs,
            images: images,
          });
          return res.status(201).json({
            status: "success",
            message: "Thanh cong",
          });
        } catch (err) {
          return catchError(err, res);
        }
      }
    }
  }
};
export default handle;
