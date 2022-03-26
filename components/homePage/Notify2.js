import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Skeleton,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Alert,
  AlertTitle,
  Fade,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import convertToTime from "../../utils/convertTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import socketIOClient from "socket.io-client";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import NotifyContent from "./NotifyContent";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
let socket;

const Notify = () => {
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
      socket.disconnect();
    };
  }, [status]);

  const socketInitializer = () => {
    socket = socketIOClient.connect(process.env.HOST_SOCKET);
    if (status === "authenticated") {
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
      // socket.on("read-notify", () => {
      //   setNumberNotify(0);
      // });
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        setDataNoti([]);
        setIsError(false);
        const results = await axios.get(`/api/notify?page=${currentPage}&results=${limitResults}`);
        if (results.data.length === limitResults) {
          setCurrentPage(currentPage + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        socket.emit("read-notify", session.user.id);
        const dataNotify = results.data.data;
        setNumberNotify(0);
        setDataNoti(dataNotify);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          setMessageError(err.response.data.message);
          setIsError(true);
          refreshError.current = setTimeout(() => {
            setIsError(false);
            setMessageError("");
          }, 5000);
        }
      }
    };
    if (status === "authenticated" && isClickNotify) {
      fetchAPI();
    }
  }, [isClickNotify, status]);

  const reFetch = async () => {
    try {
      setIsError(false);
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
    } catch (err) {
      if (err.response) {
        setMessageError(err.response.data.message);
        setIsError(true);
        refreshError.current = setTimeout(() => {
          setIsError(false);
          setMessageError("");
        }, 5000);
      }
    }
  };
  const handleClose = () => {
    setIsClickNotify(false);
    setCurrentPage(1);
    setHasMore(false);
  };

  const handleClickNotify = () => {
    setIsLoading(true);
    setDataNoti([]);
    setIsClickNotify(!isClickNotify);
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
          <NotifyButton
            onClick={() => handleClickNotify()}
            size="large"
            aria-label="show new notifications"
            sx={{
              color: (theme) => theme.palette.iconColor.default,
            }}
          >
            <Badge badgeContent={numberNotify} color="error" max={10}>
              <NotificationsIcon />
            </Badge>
          </NotifyButton>
          <DialogComponent open={isClickNotify} onClose={handleClose}>
            <DialogTitleComponent>
              {"Thông báo của bạn"}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  fontWeight: "bold",
                  color: (theme) => theme.palette.dialog.closeIcon.default,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitleComponent>
            <DialogContent
              sx={{
                padding: "20px 10px",
              }}
            >
              <Box
                sx={{
                  paddingTop: "16px",
                }}
              >
                <InfiniteScroll
                  dataLength={dataNoti.length}
                  next={reFetch}
                  hasMore={hasMore}
                  loader={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <ThreeDots fill="#06bcee" width={30} height={30} />
                    </Box>
                  }
                  height={400}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Đã hết thông báo</b>
                    </p>
                  }
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {isLoading &&
                      Array.from({ length: 4 }).map((item, i) => (
                        <ListItem
                          button={true}
                          key={i}
                          sx={{
                            maxWidth: "400px",
                            width: "100vw",
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

                        return <NotifyContent item={item} i={i} newContent={newContent} />;
                      })}
                  </Box>
                </InfiniteScroll>
              </Box>
            </DialogContent>
          </DialogComponent>
        </>
      )}
    </>
  );
};
export default Notify;
