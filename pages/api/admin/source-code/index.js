import dbConnect from "../../../../database/dbConnect";
import Code from "../../../../models/Code";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";

const handle = async (req, res) => {
  try {
    const session = await getSession({ req });
    await dbConnect();
    if (req.method === "GET") {
      let results = Code.find({}).select("-__v");
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
          const { title, content, link, costs, images, desc, keywords, labels } = req.body;
          const result = await Code.create({
            title: title,
            content: content,
            link: link,
            costs: costs,
            images: images,
            desc: desc,
            keywords: keywords,
            labels: labels,
          });
          return res.status(201).json({
            status: "success",
            message: "Tạo thành công",
          });
        }
      }
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
