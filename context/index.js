import React, { useState, useEffect } from "react";
import SocketContext from "./socket";
import socketIOClient from "socket.io-client";

const SocketProvider = (props) => {
  const [value, setValue] = useState();
  useEffect(() => {
    socketInitializer();
    console.log("khoi tao");
    return () => {
      value.disconnect();
      console.log("huy tao");
    };
  }, []);
  const socketInitializer = () => {
    const socket = socketIOClient.connect(process.env.ENDPOINT_SERVER);
    setValue(socket);
  };
  return <SocketContext.Provider value={value}>{props.children}</SocketContext.Provider>;
};
export default SocketProvider;
