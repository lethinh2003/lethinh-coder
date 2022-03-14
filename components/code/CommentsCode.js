import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Input,
  Skeleton,
  FormControl,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AiFillFileZip, AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";
import { SiZalo } from "react-icons/si";
import InstagramIcon from "@mui/icons-material/Instagram";
import CancelIcon from "@mui/icons-material/Cancel";
import NumberFormat from "react-number-format";
import axios from "axios";
import io from "socket.io-client";
let socket;
const CommentsCode = (props) => {
  const { status, session, sourceCode, router } = props;
  const getPSComment = useRef();
  const [listComments, setListComment] = useState([]);
  const [listCommentsAll, setListCommentAll] = useState([]);
  const [replyComment, setReplyComment] = useState([]);
  const [isLoadMoreComments, setIsLoadMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isGetListComments, setIsGetListComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isTypingComment, setIsTypingComment] = useState(false);
  const inputComment = useRef();
  useEffect(() => socketInitializer(), [router.query.slug, status]);
  const socketInitializer = async () => {
    await axios.get("/api/socket/comments");
    socket = io();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.emit("join-room", sourceCode[0]._id);
    socket.on("send-all-comments", (getComments) => {
      if (isLoadMoreComments) {
        setListComment(getComments);
      } else {
        setListComment(getComments.slice(0, 5));
      }
      setListCommentAll(getComments);
    });
  };
  useEffect(() => {
    const eventScrollCommentsBox = async () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c >= getPSComment.current.offsetTop - 300 && isGetListComments === false) {
        await getAPI();
      }
    };
    const getAPI = async () => {
      if (isGetListComments === false) {
        setIsLoadingComments(true);
        document.removeEventListener("scroll", eventScrollCommentsBox);
        const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        if (isLoadMoreComments) {
          setListComment(getComments.data.data);
        } else {
          setListComment(getComments.data.data.slice(0, 5));
        }
        setListCommentAll(getComments.data.data);
        setIsGetListComments(true);
        setIsLoadingComments(false);
      }
    };
    document.addEventListener("scroll", eventScrollCommentsBox);
    return () => {
      document.removeEventListener("scroll", eventScrollCommentsBox);
    };
  }, [sourceCode, isGetListComments]);

  useEffect(() => {
    if (status !== "authenticated") {
      setReplyComment([]);
    }
    const fetchAPI = async () => {
      try {
        setIsGetListComments(false);
        setIsLoadMoreComments(false);
        setListComment([]);

        if (status === "authenticated") {
          const getHistoryCommentsLiked = await axios.get("/api/history/history-like");
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
  }, [router.query.slug, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length >= 5 && isComment) {
      try {
        setIsPostingComment(true);
        if (replyComment.length === 0) {
          const result = await axios.post("/api/source-code/comments/" + sourceCode[0]._id, {
            content: comment,
          });
        } else {
          const result = await axios.post("/api/source-code/comments/reply", {
            commentId: replyComment[0].commentId,
            content: comment,
            linkNotify: `/source-code/${sourceCode[0].slug}`,
          });
          setReplyComment([]);
        }
        setComment("");
        setIsComment(false);

        setIsPostingComment(false);
        socket.emit("get-all-comments", sourceCode[0]._id);

        // const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        // if (isLoadMoreComments) {
        //   setListComment(getComments.data.data);
        // } else {
        //   setListComment(getComments.data.data.slice(0, 5));
        // }

        // setListCommentAll(getComments.data.data);
      } catch (err) {
        setIsPostingComment(false);
        console.log(err);
      }
    }
  };
  const handleChangeComment = (e) => {
    if (!isPostingComment) {
      // socket.emit("typing-comment", sourceCode[0]._id);
      setIsComment(true);
      setComment(e.target.value);
    }
  };
  const handleCLickLikeComment = async (commentId, accountId) => {
    if (status === "authenticated") {
      try {
        setIsLoading(true);
        const result = await axios.post("/api/source-code/comments/like", {
          commentId: commentId,
          accountId: accountId,
          linkNotify: `/source-code/${sourceCode[0].slug}`,
        });
        const getListCommentsStorage = localStorage.getItem("listLikeComments");
        if (result.data.message === "like") {
          if (getListCommentsStorage) {
            let convertToArray = JSON.parse(getListCommentsStorage);
            convertToArray.push(commentId);
            localStorage.setItem("listLikeComments", JSON.stringify(convertToArray));
          } else {
            const newListComments = [];
            newListComments.push(commentId);
            localStorage.setItem("listLikeComments", JSON.stringify(newListComments));
          }
        } else if (result.data.message === "unlike") {
          let convertToArray = JSON.parse(getListCommentsStorage);
          const filterArray = convertToArray.filter((item) => item !== commentId);
          localStorage.setItem("listLikeComments", JSON.stringify(filterArray));
        }
        socket.emit("get-all-comments", sourceCode[0]._id);

        // const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        // setListComment(getComments.data.data.slice(0, 5));
        // setListCommentAll(getComments.data.data);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    }
  };
  const checkLikedComment = (id) => {
    const getListCommentsStorage = localStorage.getItem("listLikeComments");
    let check = false;
    if (getListCommentsStorage) {
      JSON.parse(getListCommentsStorage).forEach((item) => {
        if (item === id) {
          check = true;
        }
      });
    }
    return check;
  };

  const handleClickLoadMoreComments = () => {
    setIsLoadMoreComments(true);
    setListComment(listCommentsAll);
  };

  const handleClickReplyComment = (comment) => {
    if (!isPostingComment) {
      const content = [
        {
          commentId: comment._id,
          commentAccount: comment.user[0].account,
        },
      ];
      setReplyComment(content);
      window.scrollTo(0, getPSComment.current.offsetTop);
    }
  };
  const handleClickCancelReply = () => {
    if (!isPostingComment) {
      setReplyComment([]);
    }
  };

  return (
    <>
      <h1 className="title" ref={getPSComment} id="comments">
        Comments
      </h1>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {replyComment.length > 0 && status === "authenticated" && (
        <Typography
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            padding: "5px",
            border: "1px solid",
            borderRadius: "10px",
          }}
        >
          <Typography>
            Đang trả lời cho{" "}
            {session.user.account !== replyComment[0].commentAccount ? replyComment[0].commentAccount : "chính tôi"}
            <IconButton onClick={() => handleClickCancelReply()}>
              <CancelIcon />
            </IconButton>
          </Typography>
        </Typography>
      )}
      <form
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          gap: "5px",
        }}
        onSubmit={(e) => handleSubmit(e)}
      >
        <Input
          ref={inputComment}
          disabled={status === "authenticated" ? false : true}
          value={comment}
          placeholder="Nhập bình luận"
          sx={{
            width: "300px",
          }}
          onChange={(e) => handleChangeComment(e)}
          error={isComment && comment.length < 5 ? true : false}
        />
        {isComment && comment.length < 5 && (
          <Typography sx={{ color: "#f44336" }}>Comment phải trên 5 kí tự</Typography>
        )}
        {status !== "authenticated" && (
          <Typography sx={{ color: "#f44336" }}>Bạn phải đăng nhập để bình luận</Typography>
        )}

        {status === "authenticated" && (
          <Button variant="contained" disabled={comment.length < 5 ? true : false} onClick={(e) => handleSubmit(e)}>
            Bình luận
          </Button>
        )}
      </form>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: { xs: "0 10px", md: "0 40px" },
        }}
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
        {listComments.length === 0 && !isPostingComment && <Typography>Hãy là người đầu tiên bình luận</Typography>}
        {listComments.length > 0 &&
          listComments.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Noto Sans",
              }}
            >
              <ListItem button={true}>
                <ListItemAvatar>
                  <Avatar alt={item.user[0].account}>{item.user[0].account.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.user[0].account} - ${item.user[0].role === "admin" ? "Admin" : "Member"} `}
                  secondary={item.content}
                ></ListItemText>
                <IconButton
                  size="large"
                  aria-label="show likes"
                  color="inherit"
                  onClick={status === "authenticated" ? () => handleCLickLikeComment(item._id, session.user.id) : null}
                >
                  <Badge badgeContent={item.likes.length} color="error">
                    <ThumbUpAltIcon
                      sx={{
                        color: checkLikedComment(item._id) ? "#2d82d6" : "inherit",
                      }}
                    />
                  </Badge>
                </IconButton>
              </ListItem>

              <Typography
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                <Typography
                  sx={{
                    paddingLeft: "18px",
                    fontStyle: "italic",
                    fontSize: "12px",
                  }}
                >
                  {convertTime(item.createdAt)}
                </Typography>
                {status === "authenticated" && (
                  <Typography
                    sx={{
                      paddingLeft: "18px",
                      fontStyle: "italic",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickReplyComment(item)}
                  >
                    Reply
                  </Typography>
                )}
              </Typography>

              {item.reply.length > 0 &&
                item.reply.map((replyItem) => (
                  <Box key={replyItem._id} sx={{ paddingLeft: "20px" }}>
                    <ListItem button={true}>
                      <ListItemAvatar>
                        <Avatar alt={replyItem.user[0].account}>{replyItem.user[0].account.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${replyItem.user[0].account} - ${
                          replyItem.user[0].role === "admin" ? "Admin" : "Member"
                        } `}
                        secondary={replyItem.content}
                      ></ListItemText>
                    </ListItem>
                    <Typography
                      sx={{
                        paddingLeft: "18px",
                        fontStyle: "italic",
                        fontSize: "12px",
                      }}
                    >
                      {convertTime(replyItem.createdAt)}
                    </Typography>
                  </Box>
                ))}
            </Box>
          ))}
      </Box>
      {listCommentsAll.length >= 5 && listComments.length > 0 && !isLoadMoreComments && (
        <Button variant="outlined" onClick={handleClickLoadMoreComments}>
          Xem tất cả
        </Button>
      )}
    </>
  );
};
export default CommentsCode;
