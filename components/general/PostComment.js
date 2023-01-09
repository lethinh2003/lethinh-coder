import {
  Box,
  Button,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import SocketContext from "../../context/socket";
import InputComment from "./InputComment";
import ItemComment from "./ItemComment";
const PostComment = (props) => {
  const socket = useContext(SocketContext);
  const { status, session, postData, typePost } = props;
  const boxCommentRef = useRef();
  const [replyComment, setReplyComment] = useState(null);
  const [isTypingComment, setIsTypingComment] = useState(false);
  const [limitResults, setLimitResults] = useState(process.env.LIMIT_RESULTS * 1 || 10);
  const hostServer = process.env.ENDPOINT_SERVER;
  const callDataApi = async (queryKey, pageParam) => {
    const results = await axios.get(
      `${hostServer}/api/v1/comments/detail/` + queryKey + `?page=${pageParam}&results=${limitResults}`
    );
    return results.data;
  };
  const { data, isLoading, isFetching, isError, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["get-comments-detail", postData._id],
      ({ pageParam = 1 }) => callDataApi(postData._id, pageParam),
      {
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        getNextPageParam: (_lastPage, pages) => {
          if (pages[pages.length - 1].length === limitResults) {
            return pages.length + 1;
          }
          return undefined;
        },
      }
    );

  useEffect(() => {
    if (socket) {
      socketInitializer();
    }
    return () => {
      if (socket) {
        socket.off("refetch-comment-post");
        socket.off("typing-comment");
      }
    };
  }, [postData, socket, session]);

  const socketInitializer = () => {
    // Join room socket by post ID
    socket.emit("join-room", postData._id);
    // Refetch list comment
    socket.on("refetch-comment-post", () => {
      refetch();
    });
    // Somebody is typing comment
    socket.on("typing-comment", (data) => {
      if (status === "unauthenticated" || data.account !== session?.user.account) {
        setIsTypingComment(data.value);
      }
    });
  };
  // Functions
  const handleClickReplyComment = (comment) => {
    setReplyComment(comment);
    boxCommentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // UI Components
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  return (
    <>
      <TitleContent className="title" ref={boxCommentRef} id="comments">
        Comments
      </TitleContent>
      {status === "authenticated" && (
        <InputComment
          replyComment={replyComment}
          setReplyComment={setReplyComment}
          status={status}
          session={session}
          postData={postData}
          typePost={typePost}
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: { xs: "0 10px", md: "0 40px" },
        }}
      >
        {isError && (
          <Typography
            sx={{
              color: "#ea5e5e",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Error: {error && error.response ? `${error.response.data.message}` : "Something went wrong"}
          </Typography>
        )}
        {isTypingComment && <Typography>Ai đó đang nhập bình luận ...</Typography>}

        {data?.pages[0].length === 0 && !isLoading && <Typography>Hãy là người đầu tiên bình luận</Typography>}

        {/* Loading list comments */}
        {isLoading &&
          Array.from({ length: 5 }).map((item, i) => (
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

        {!isLoading &&
          data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map((item) => {
                return (
                  <ItemComment
                    key={item._id}
                    postData={postData}
                    handleClickReplyComment={handleClickReplyComment}
                    item={item}
                    socket={socket}
                    typePost={typePost}
                  />
                );
              })}
            </React.Fragment>
          ))}
        {isFetchingNextPage && (
          <CircularProgress
            sx={{
              alignSelf: "center",
            }}
          />
        )}
        {hasNextPage && !isFetchingNextPage && (
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Button variant="contained" onClick={() => fetchNextPage()}>
              Load more
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};
export default PostComment;
