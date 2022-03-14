import { Server } from "socket.io";
let allUser = [];
const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("get-all-users", () => {
        io.sockets.emit("get-all-users", allUser);
      });
      socket.on("user-join", (name) => {
        if (allUser.indexOf(name) !== -1) {
          socket.emit("user-join-error", `${name} đã tồn tại!`);
        } else {
          allUser.push(name);
          io.sockets.emit("user-join-success", allUser);
          socket.userName = name;
        }
      });
      socket.on("typing-comment", () => {
        socket.broadcast.emit("typing-comment", "Ai đó đang nhập chat");
      });
      socket.on("disconnect", () => {
        allUser.splice(allUser.indexOf(socket.userName), 1);
        io.sockets.emit("get-all-users", allUser);
      });
    });
  }
  res.end();
};

export default SocketHandler;
