import {
  Backdrop,
  Box,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loading-icons";
import SocketContext from "../../context/socket";
import InputComment from "./InputComment";
import ItemComment from "./ItemComment";

const CommentsCode = (props) => {
  const socket = useContext(SocketContext);
  const { status, session, blogData, router } = props;
  const getPSComment = useRef();
  const [count, setCount] = useState(0);
  const [listComments, setListComment] = useState([]);
  const [listCommentsAll, setListCommentAll] = useState([]);
  const [replyComment, setReplyComment] = useState(null);
  const [isLoadMoreComments, setIsLoadMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isGetListComments, setIsGetListComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isTypingComment, setIsTypingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 100);
  const inputComment = useRef();
  const hostServer = process.env.ENDPOINT_SERVER;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (socket) {
      socketInitializer();
    }
    return () => {
      if (socket) {
        socket.off("send-all-comments");

        socket.off("send-room-history-likes");
        socket.off("create-new-comment");
      }
    };
  }, [blogData, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("create-comment", (data) => {
        const currentListComment = [...listComments];

        const newListComment = [data].concat(currentListComment);

        setListComment(newListComment);
      });
    }
    return () => {
      if (socket) {
        socket.off("create-comment");
      }
    };
  }, [listComments, socket]);
  const socketInitializer = () => {
    socket.emit("join-room", blogData._id);

    socket.on("send-all-comments", async (getComments) => {
      setHasMore(false);
      setListComment(getComments);
      setListCommentAll(getComments);
    });

    socket.on("send-room-history-likes", async () => {
      if (status === "authenticated") {
        const getHistoryCommentsLiked = await axios.get(`${hostServer}/api/v1/comments/history-like`);
        if (getHistoryCommentsLiked.data.data.length > 0) {
          const newArrayToPush = [];
          const listCommentsLiked = getHistoryCommentsLiked.data.data;
          listCommentsLiked.map((item) => {
            newArrayToPush.push(item.comment[0]);
          });

          localStorage.setItem("listLikeComments", JSON.stringify(newArrayToPush));
        }
      }
    });
  };

  useEffect(() => {
    const eventScrollCommentsBox = async () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (getPSComment.current && c >= getPSComment.current.offsetTop - 500 && isGetListComments === false) {
        setCurrentPage(1);
        await getAPI();
      }
    };
    const getAPI = async () => {
      if (isGetListComments === false) {
        setIsLoadingComments(true);

        document.removeEventListener("scroll", eventScrollCommentsBox);
        const getComments = await axios.get(
          `${hostServer}/api/v1/comments/detail/` + blogData._id + `?page=${currentPage}&results=${limitResults}`
        );
        if (getComments.data.length === limitResults) {
          setCurrentPage((currentPage) => currentPage + 1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setListComment(getComments.data.data);

        setListCommentAll(getComments.data.data);
        setIsGetListComments(true);
        setIsLoadingComments(false);
      }
    };
    document.addEventListener("scroll", eventScrollCommentsBox);
    return () => {
      document.removeEventListener("scroll", eventScrollCommentsBox);
    };
  }, [blogData, isGetListComments]);
  const reFetch = async () => {
    try {
      const results = await axios.get(
        `${hostServer}/api/v1/comments/detail/` + blogData._id + `?page=${currentPage}&results=${limitResults}`
      );
      if (results.data.length === limitResults) {
        setCurrentPage((currentPage) => currentPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      let dataNotify = results.data.data;

      const newData = [...listComments, ...dataNotify];

      setListComment(newData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setReplyComment(null);

    const fetchAPI = async () => {
      try {
        setIsGetListComments(false);
        setIsLoadMoreComments(false);
        setListComment([]);

        if (status === "authenticated") {
          socket.emit("join-room-history-likes", session.user.id);
          const getHistoryCommentsLiked = await axios.get(`${hostServer}/api/v1/comments/history-like`);
          if (getHistoryCommentsLiked.data.data.length > 0) {
            const newArrayToPush = [];
            const listCommentsLiked = getHistoryCommentsLiked.data.data;
            listCommentsLiked.map((item) => {
              newArrayToPush.push(item.comment[0]);
            });

            localStorage.setItem("listLikeComments", JSON.stringify(newArrayToPush));
          }
          setComment("");
          setIsComment(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAPI();
  }, [blogData, status]);

  const handleClickReplyComment = (comment) => {
    if (!isPostingComment) {
      setReplyComment(comment);
      getPSComment.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handleDeleteComment = (commentID) => {
    const currentListComment = [...listComments];
    const removeComment = currentListComment.filter((item, i) => item._id !== commentID);
    setListComment(removeComment);
  };

  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
  });
  return (
    <>
      <TitleContent className="title" ref={getPSComment} id="comments">
        Comments
      </TitleContent>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <InputComment
        replyComment={replyComment}
        setReplyComment={setReplyComment}
        status={status}
        session={session}
        blogData={blogData}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: { xs: "0 10px", md: "0 40px" },
        }}
      >
        <InfiniteScroll
          dataLength={listComments.length}
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
        >
          {isTypingComment && <h3>Ai đó đang nhập bình luận ...</h3>}
          {isPostingComment && (
            <CircularProgress
              sx={{
                alignSelf: "center",
              }}
            />
          )}
          {isLoadingComments &&
            Array.from({ length: 4 }).map((item, i) => (
              <ListItem button={true} key={i}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText>
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" />
                </ListItemText>
              </ListItem>
            ))}
          {listComments.length === 0 && !isLoadingComments && <Typography>Hãy là người đầu tiên bình luận</Typography>}
          {!isLoadingComments &&
            listComments.length > 0 &&
            listComments.map((item, i) => (
              <ItemComment
                handleDeleteComment={handleDeleteComment}
                key={item._id}
                blogData={blogData}
                handleClickReplyComment={handleClickReplyComment}
                item={item}
                socket={socket}
              />
            ))}
        </InfiniteScroll>
      </Box>
    </>
  );
};
export default CommentsCode;
