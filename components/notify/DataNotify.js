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
import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import SocketContext from "../../context/socket";
import NotifyContent from "./NotifyContent";

const DataNotify = () => {
  const socket = useContext(SocketContext);
  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(true);
  const [dataNoti, setDataNoti] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(10);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();

  const callDataApi = async () => {
    const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);
    return results.data;
  };
  const getListQuery = useQuery("get-notifies-current-user", callDataApi, {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { data, isLoading, isFetching, isError: isErrorQuery, error, refetch } = getListQuery;
  useEffect(() => {
    if (error && error.response) {
      setMessageError(error.response.data.message);
      setIsError(true);
      refreshError.current = setTimeout(() => {
        setIsError(false);
        setMessageError("");
      }, 5000);
    }
  }, [isErrorQuery]);

  useEffect(() => {
    if (data) {
      setDataNoti(data.data);
    }
  }, [data]);

  const handleClickNotify = () => {
    setIsClickNotify(!isClickNotify);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          margin: "10px 0px",
          color: (theme) => theme.palette.iconColor.default,
        }}
      >
        {isLoading &&
          Array.from({ length: limitResults }).map((item, i) => (
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
          data?.data.map((item, i) => {
            let newContent = item.content;
            const content = item.content;
            if (content.includes("{name}")) {
              newContent = newContent.replace("{name}", item.account_send[0].name);
            }

            return (
              <NotifyContent
                key={i}
                refetch={refetch}
                item={item}
                handleClickNotify={handleClickNotify}
                newContent={newContent}
              />
            );
          })}
        {dataNoti.length >= 10 && (
          <Typography
            sx={{
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Link href={`/users/${session.user.account}`}>Xem thêm</Link>
          </Typography>
        )}
      </Box>
    </>
  );
};
export default DataNotify;
