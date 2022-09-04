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
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import { useQuery } from "react-query";
import CommentContent from "./CommentContent";
const Comments = ({ user, socket }) => {
  const router = useRouter();

  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();

  const [hasMore, setHasMore] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const [dataComment, setDataComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 100);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshError = useRef();

  const callDataApi = async (user) => {
    if (!user) {
      return null;
    }
    const results = await axios.get(
      `${hostServer}/api/v1/comments?accountID=${user._id}&page=${currentPage}&results=${limitResults}`
    );
    return results.data;
  };

  const getListQuery = useQuery(["get-comments-detail-user", user], () => callDataApi(user), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    staleTime: 0,
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
      setDataComment(data.data);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      clearTimeout(refreshError.current);
    };
  }, []);

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

  const ActivitiesTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });

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
