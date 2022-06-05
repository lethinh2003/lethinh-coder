import {
  Alert,
  AlertTitle,
  Box,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "../../context/socket";
import NotifyContent from "./NotifyContent";
const DataNotify = () => {
  const socket = useContext(SocketContext);
  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataNoti, setDataNoti] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(10);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        setDataNoti([]);
        setIsError(false);
        const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);

        const dataNotify = results.data.data;
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

    fetchAPI();
  }, []);

  const handleClickNotify = () => {
    setIsClickNotify(!isClickNotify);
  };

  const handleClickDelete = async (id) => {
    setIsError(false);
    try {
      await axios.post(`${hostServer}/api/v1/notifies/delete`, {
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

  return (
    <>
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
                key={i}
                item={item}
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
    </>
  );
};
export default DataNotify;
