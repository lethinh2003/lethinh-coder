import { Box, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
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
      socket.emit("join-notify", session.user.id);
      socket.emit("get-notify", session.user.id);
    }
  };
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get(`/api/notify?page=${currentPage}&results=${limitResults}`);
        socket.emit("read-notify", session.user.id);
        if (results.data.length === limitResults) {
          setCurrentPage(currentPage + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        const dataNotify = results.data.data;
        setDataNoti(dataNotify);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchAPI();
    }
  }, [status]);

  const reFetch = async () => {
    try {
      const results = await axios.get(`/api/notify?page=${currentPage}&results=${limitResults}`);
      if (results.data.length === limitResults) {
        setCurrentPage(currentPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      const dataNotify = results.data.data;
      const newData = [...dataNoti, ...dataNotify];

      setDataNoti(newData);
    } catch (err) {}
  };
  console.log("render");
  const handleClose = () => {
    setCurrentPage(1);
    setHasMore(false);
  };

  const handleClickDelete = async (id) => {
    try {
      await axios.post("/api/notify", {
        notifyId: id,
      });
      const newArray = [...dataNoti];
      const newArrayRemoveItem = newArray.filter((item) => item._id !== id);
      setDataNoti(newArrayRemoveItem);
    } catch (err) {
      console.log(err);
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
              <ActivitiesTitle>Đăng nhập</ActivitiesTitle>
              <ActivitiesTitle>Bình luận</ActivitiesTitle>
              {/* {isLoading &&
                Array.from({ length: 4 }).map((item, i) => (
                  <ListItem
                    button={true}
                    key={i}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText>
                      <Skeleton variant="text" height={70} />
                      <Skeleton variant="text" width={100} />
                    </ListItemText>
                  </ListItem>
                ))}
              {isError && (
                <Fade in={isError}>
                  <Alert
                    sx={{
                      maxWidth: "400px",
                      width: "100%",
                      borderRadius: "20px",
                      border: "1px solid #914b31",
                    }}
                    severity="error"
                  >
                    <AlertTitle>Error</AlertTitle>
                    {messageError} — <strong>try again!</strong>
                  </Alert>
                </Fade>
              )}
              {!isLoading && dataNoti.length === 0 && !isError && (
                <Typography
                  sx={{
                    maxWidth: "400px",
                    width: "100vw",
                    textAlign: "center",
                  }}
                >
                  Thông báo trống
                </Typography>
              )}
              {!isLoading &&
                dataNoti.length > 0 &&
                dataNoti.map((item, i) => {
                  let newContent = item.content;
                  const content = item.content;
                  if (content.includes("{name}")) {
                    newContent = newContent.replace("{name}", item.account_send[0].name);
                  }

                  return (
                    <NotifyContent item={item} i={i} newContent={newContent} handleClickDelete={handleClickDelete} />
                  );
                })} */}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Signup;
