import {
  Alert,
  AlertTitle,
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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import NotifyContent from "../../components/homePage/NotifyContent";
import { useQuery } from "react-query";

const Notifies = ({ user, socket }) => {
  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
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
      clearTimeout(refreshError.current);
    };
  }, []);
  const callDataApi = async () => {
    const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);
    socket.emit("read-notify", user._id);
    return results.data;
  };
  const getListQuery = useQuery("get-notifies-user", callDataApi, {
    cacheTime: Infinity, //Thời gian cache data, ví dụ: 5000, sau 5s thì cache sẽ bị xóa, khi đó data trong cache sẽ là undefined
    refetchOnWindowFocus: false,
  });
  const { data, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
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
      if (data.results === limitResults) {
        setCurrentPage((currentPage) => currentPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setDataNoti(data.data);
    }
  }, [data]);

  const socketInitializer = () => {
    socket.emit("join-notify", session.user.id);
    socket.emit("get-notify", session.user.id);
  };
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsError(false);
        setIsLoading(true);
        const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);
        socket.emit("read-notify", user._id);

        if (results.data.results === limitResults) {
          setCurrentPage((currentPage) => currentPage + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
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

    // fetchAPI();
  }, []);

  const reFetch = async () => {
    try {
      setIsError(false);
      const results = await axios.get(`${hostServer}/api/v1/notifies?page=${currentPage}&results=${limitResults}`);
      if (results.data.results === limitResults) {
        setCurrentPage((currentPage) => currentPage + 1);
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
  const handleClickDelete = async (id) => {
    try {
      setIsError(false);
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
                  width: "100%",
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
                    i={i}
                    newContent={newContent}
                    handleClickDelete={handleClickDelete}
                  />
                );
              })}
          </Box>
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default Notifies;
