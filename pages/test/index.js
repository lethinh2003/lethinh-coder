import { useContext } from "react";
import SocketContext from "../../context/socket";
const Test = () => {
  const socket = useContext(SocketContext);
  console.log(socket);
  return (
    <>
      <h1>Hello</h1>
    </>
  );
};
export default Test;
