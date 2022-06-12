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
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import socketIOClient from "socket.io-client";
import convertToTime from "../../utils/convertTime";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "react-query";
import CommentContent from "./CommentContent";
import { motion } from "framer-motion";
const Comments = ({ user, socket }) => {
  const router = useRouter();

  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  // const callDataApi = async () => {
  //   const results = await axios.get(
  //     `${hostServer}/api/v1/comments?accountID=${user._id}&page=${currentPage}&results=${limitResults}`
  //   );
  //   return results.data;
  // };
  // const getListQuery = useQuery("get-comments-user", callDataApi, {
  //   cacheTime: Infinity, //Thời gian cache data, ví dụ: 5000, sau 5s thì cache sẽ bị xóa, khi đó data trong cache sẽ là undefined
  //   refetchOnWindowFocus: false,
  // });
  // const { data, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
  // console.log(getListQuery);

  // useEffect(() => {
  //   if (error && error.response) {
  //     setMessageError(error.response.data.message);
  //     setIsError(true);
  //     refreshError.current = setTimeout(() => {
  //       setIsError(false);
  //       setMessageError("");
  //     }, 5000);
  //   }
  // }, [isErrorQuery]);
  // useEffect(() => {
  //   if (data) {
  //     if (data.results === limitResults) {
  //       setCurrentPage((currentPage) => currentPage + 1);
  //       setHasMore(true);
  //     } else {
  //       setHasMore(false);
  //     }
  //     setDataComment(data.data);
  //   }
  // }, [data]);

  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataComment, setDataComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 100);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(refreshError.current);
    };
  }, []);

  useEffect(() => {
    const getComments = async () => {
      try {
        setIsError(false);
        setIsLoading(true);
        const results = await axios.get(
          `${hostServer}/api/v1/comments?accountID=${user._id}&page=${currentPage}&results=${limitResults}`
        );
        if (results.data.results === limitResults) {
          setCurrentPage((currentPage) => currentPage + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        const dataComments = results.data.data;
        setDataComment(dataComments);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response.data) {
          setMessageError(err.response.data.message);
          setIsError(true);
          refreshError.current = setTimeout(() => {
            setIsError(false);
            setMessageError("");
          }, 5000);
        }
      }
    };

    getComments();
  }, [user]);

  const getCommentsByPage = async () => {
    try {
      setIsError(false);
      const results = await axios.get(
        `${hostServer}/api/v1/comments?accountID=${user._id}&page=${currentPage}&results=${limitResults}`
      );
      if (results.data.results === limitResults) {
        setCurrentPage(currentPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      const dataNotify = results.data.data;
      const newData = [...dataComment, ...dataNotify];

      setDataComment(newData);
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
  const handleClickDelete = async (id, postId) => {
    try {
      setIsError(false);
      await axios.post(`${hostServer}/api/v1/comments/delete`, {
        commentId: id,
      });
      // socket.emit("get-all-comments", postId);
      const data = {
        id: id,
      };
      socket.emit("delete-comment", data);
      const newArray = [...dataComment];
      const newArrayRemoveItem = newArray.filter((item) => item._id !== id);
      setDataComment(newArrayRemoveItem);
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
  const ActivitiesTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  const handleClickLinkComment = (item) => {
    if (item && item.code[0]) {
      router.push(`/source-code/${item.code[0].slug}`);
    } else if (item && item.blog[0]) {
      router.push(`/blog/${item.blog[0].slug}`);
    }
  };

  return (
    <>
      <ActivitiesTitle>Bình luận</ActivitiesTitle>

      <Box
        sx={{
          paddingTop: "16px",
        }}
      >
        <InfiniteScroll
          dataLength={dataComment.length}
          next={getCommentsByPage}
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
            <Box
              sx={{
                marginTop: "10px",
                backgroundColor: "#374151",
                padding: "15px",
                borderRadius: "10px",
                fontSize: "1.5rem",
                color: "#ffffff",
              }}
            >
              Đã hết danh sách 👏🏼
            </Box>
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
            {!isLoading && dataComment.length === 0 && !isError && (
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Danh sách trống
              </Typography>
            )}
            {!isLoading &&
              dataComment.length > 0 &&
              dataComment.map((item, i) => {
                let newContent = item.content;
                const content = item.content;

                return <CommentContent key={i} newContent={newContent} item={item} socket={socket} user={user} />;
              })}
          </Box>
        </InfiniteScroll>
      </Box>
    </>
  );
};
export default Comments;
