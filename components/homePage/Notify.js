import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Box, IconButton } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import SocketContext from "../../context/socket";
import DataNotify from "../notify/DataNotify";
const Notify = () => {
  const socket = useContext(SocketContext);
  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataNoti, setDataNoti] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(10);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();
  const refreshSocket = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(refreshError.current);
      clearTimeout(refreshSocket.current);
    };
  }, []);
  useEffect(() => {
    socketInitializer();
    return () => {
      socket.off("join-notify");
      socket.off("get-notify");
      socket.off("send-notify");
      socket.off("read-notify");
    };
  }, []);

  const socketInitializer = () => {
    socket.emit("join-notify", session.user.id);
    socket.emit("get-notify", session.user.id);
    socket.on("send-notify", (data) => {
      let notifyNum = 0;
      if (data.length > 0) {
        data.map((item) => {
          if (!item.status) {
            notifyNum += 1;
          }
        });
        setNumberNotify(notifyNum);
      }
    });
    socket.on("read-notify", () => {
      setNumberNotify(0);
    });
  };

  const handleClickNotify = () => {
    if (isClickNotify) {
      socket.emit("read-notify", session.user.id);
    }
    setIsClickNotify(!isClickNotify);
  };

  const NotifyButton = styled(IconButton)({});

  const NotifyContainer = styled(Box)(({ theme }) => ({
    overflow: "auto",
    backgroundColor: theme.palette.dialog.bgColor.default,
    height: "400px",
    maxWidth: "600px",
    width: "100%",
    position: "fixed",
    top: "70px",
    right: "0",
    borderRadius: "20px",
    border: `1px solid ${theme.palette.dialog.borderColor.default}`,
    boxShadow:
      "0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
  }));

  return (
    <>
      <NotifyButton
        onClick={() => handleClickNotify()}
        size="large"
        aria-label="show new notifications"
        sx={{
          color: (theme) => theme.palette.iconColor.default,
          border: isClickNotify ? "2px solid rgb(0 123 255 / 50%)" : null,
        }}
      >
        <Badge badgeContent={numberNotify} color="error" max={10}>
          <NotificationsIcon />
        </Badge>
      </NotifyButton>

      {isClickNotify && (
        <ClickAwayListener onClickAway={() => handleClickNotify()}>
          <NotifyContainer
            as={motion.div}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
          >
            <TransitionGroup>
              <DataNotify />
            </TransitionGroup>
          </NotifyContainer>
        </ClickAwayListener>
      )}
    </>
  );
};
export default Notify;
