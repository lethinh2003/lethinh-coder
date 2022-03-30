import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Alert,
  AlertTitle,
  Badge,
  Box,
  Dialog,
  DialogTitle,
  Fade,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import socketIOClient from "socket.io-client";
import NotifyContent from "./NotifyContent";
import { motion } from "framer-motion";
import ClickAwayListener from "@mui/material/ClickAwayListener";
let socket;
const Notify = () => {
  const hostServer = process.env.HOST_SOCKET;
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

  const socketInitializer = async () => {
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
      socket.on("read-notify", () => {
        setNumberNotify(0);
      });
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        setDataNoti([]);
        setIsError(false);
        const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);
        await socket.emit("read-notify", session.user.id);
        const dataNotify = results.data.data;
        // setNumberNotify(0);
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

  const handleClose = () => {
    setIsClickNotify(false);
  };

  const handleClickNotify = () => {
    setIsLoading(true);
    setDataNoti([]);
    setIsClickNotify(!isClickNotify);
  };

  const handleClickDelete = async (id) => {
    setIsError(false);
    try {
      await axios.post(`${hostServer}/api/v1/notifies`, {
        notifyId: id,
      });
      const newArray = [...dataNoti];
      const newArrayRemoveItem = newArray.filter((item) => item._id !== id);
      setDataNoti(newArrayRemoveItem);
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
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };
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
              border: isClickNotify ? "2px solid rgb(0 123 255 / 50%)" : null,
            }}
          >
            <Badge badgeContent={numberNotify} color="error" max={10}>
              <NotificationsIcon />
            </Badge>
          </NotifyButton>

          {isClickNotify && (
            <ClickAwayListener onClickAway={() => setIsClickNotify(false)}>
              <NotifyContainer
                as={motion.div}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                }}
              >
                <TransitionGroup>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "20px",
                      color: (theme) => theme.palette.iconColor.default,
                    }}
                  >
                    {isLoading &&
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
                          <NotifyContent
                            item={item}
                            i={i}
                            handleClickNotify={handleClickNotify}
                            handleClickDelete={handleClickDelete}
                            newContent={newContent}
                          />
                        );
                      })}
                    {dataNoti.length >= 10 && (
                      <Link href={`/users/${session.user.account}`}>
                        <Typography
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Xem thêm
                        </Typography>
                      </Link>
                    )}
                  </Box>
                </TransitionGroup>
              </NotifyContainer>
            </ClickAwayListener>
          )}
          {/* 
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
          </DialogComponent> */}
        </>
      )}
    </>
  );
};
export default Notify;
