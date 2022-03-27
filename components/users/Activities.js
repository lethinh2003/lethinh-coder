import { Box, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import Comments from "./Comments";
import RepComments from "./RepComments";
let socket;
const Signup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataNoti, setDataNoti] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(5);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();
  const refreshSocket = useRef();
  useEffect(() => {
    socketInitializer();
    return () => {
      socket.disconnect();
    };
  }, [status]);
  const socketInitializer = () => {
    socket = socketIOClient.connect(process.env.HOST_SOCKET);
    if (status === "authenticated") {
    }
  };

  const ActivitiesTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
    fontWeight: "bold",
  });
  const NotifyButton = styled(IconButton)({});
  const DialogComponent = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      backgroundColor: theme.palette.dialog.bgColor.default,
      border: `1px solid ${theme.palette.dialog.borderColor.default}`,
      margin: 0,
    },
  }));
  const DialogTitleComponent = styled(DialogTitle)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.dialog.borderColor.bottom}`,
    fontWeight: "bold",
  }));
  return (
    <>
      {status === "authenticated" && (
        <>
          <Box
            sx={{
              paddingTop: "16px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Comments />
              <RepComments />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Signup;
