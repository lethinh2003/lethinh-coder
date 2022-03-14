import { Server } from "socket.io";
import dbConnect from "../../../database/dbConnect";
import catchError from "../../../utils/catchError";
import Comment from "../../../models/Comment";

import axios from "axios";
let allUser = [];
const SocketHandler = async (req, res) => {
  await dbConnect();
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join-room", (data) => {
        socket.leave(socket.room_code);
        socket.join(data);
        socket.room_code = data;
      });
      socket.on("get-all-comments", async (codeId) => {
        try {
          const results = await Comment.find({
            code: codeId,
          })
            .populate({
              path: "user",
              select: "-__v -password",
            })
            .populate({
              path: "reply",
              select: "-__v -password",
            })

            .sort("-_id")
            .select("-__v");
          io.sockets.in(codeId).emit("send-all-comments", results);
        } catch (err) {
          console.log(err);
        }
      });

      socket.on("disconnecting", () => {
        socket.leave(socket.room_code);
      });
      socket.on("disconnect", () => {});
    });
  }
  res.end();
};

export default SocketHandler;
