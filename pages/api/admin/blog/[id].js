import dbConnect from "../../../../database/dbConnect";
import Blog from "../../../../models/Blog";
import catchError from "../../../../utils/catchError";
import { getSession } from "next-auth/react";
import axios from "axios";

const handle = async (req, res) => {
  const session = await getSession({ req });
  await dbConnect();
  if (req.method === "GET") {
    let results = Blog.find({ _id: req.query.id }).select("-__v");
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
        const { title, content, readTime, images, id, status, desc, labels, keywords } = req.body;
        try {
          const result = await Blog.findByIdAndUpdate(
            id,
            {
              title: title,
              content: content,

              readTime: readTime,
              images: images,
              status: status,
              desc: desc,
              labels: labels,
              keywords: keywords,
              updatedAt: new Date().toISOString(),
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Thanh cong",
          });
        } catch (err) {
          return catchError(err, res);
        }
      }
    }
  } else if (req.method === "DELETE") {
    if (session && session.user) {
      if (session.user.role === "user") {
        return res.status(400).json({
          status: "fail",
          message: "You can't access this router",
        });
      } else {
        const { id } = req.query;
        try {
          const result = await Blog.remove({
            _id: id,
          });

          return res.status(204).json({
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
