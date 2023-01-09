import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Box, Button, CircularProgress, IconButton, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import SocketContext from "../../context/socket";
import EmojiPickerData from "../Button/EmojiPickerData";
import RepCommentContent from "./RepCommentContent";
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const InputComment = (props) => {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const { data: session, status } = useSession();
  const { postData, replyComment, setReplyComment, typePost } = props;
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isOpenEmotionIcon, setIsOpenEmotionIcon] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const typingCommentTimeout = useRef();
  const hostServer = process.env.ENDPOINT_SERVER;
  useEffect(() => {
    setIsComment(false);
    setComment("");
    return () => {
      clearTimeout(typingCommentTimeout.current);
    };
  }, [postData]);

  //#region Các hàm sự kiện
  // Sự kiện submit comment
  const handleSubmitComment = async (e, receiveId) => {
    e.preventDefault();
    if (comment.length >= 5 && isComment) {
      try {
        setIsPostingComment(true);
        if (!replyComment) {
          // Tạo comment mới
          const result = await axios.post(`${hostServer}/api/v1/comments/detail/` + postData._id, {
            content: comment,
            type: typePost, // code or blog
          });
          // Refetch list comment
          socket.emit("refetch-comment-post", postData._id);
        } else {
          // Tạo reply comment
          const result = await axios.post(`${hostServer}/api/v1/comments/reply`, {
            commentId: replyComment._id,
            content: comment,
            linkNotify: `/${typePost === "code" ? "source-code" : typePost}/${postData.slug}`,
          });
          // Refetch list comment
          socket.emit("refetch-comment-post", postData._id);
          // Send notify cho chủ comment
          socket.emit("get-notify", receiveId);
          const listUserGetNotify = result.data.meta.user_receive;
          // Gửi thông báo cho các user khác
          if (listUserGetNotify.length > 0) {
            listUserGetNotify.forEach((item, i) => {
              socket.emit("get-notify", item.accountID);
            });
          }

          setReplyComment(null);
        }
        setComment("");
        setIsComment(false);
        setIsPostingComment(false);
      } catch (err) {
        setIsPostingComment(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };
  // Sự kiện onChange Comment
  const handleChangeComment = (value) => {
    if (!isPostingComment) {
      setIsComment(true);
      setComment(value);
      // Cleanup timeout từ typing comment socket
      if (typingCommentTimeout.current) {
        clearTimeout(typingCommentTimeout.current);
      }
      const dataSocket = {
        room: postData._id,
        value: false,
        account: session.user.account,
      };
      if (!value) {
        socket.emit("typing-comment", { ...dataSocket, value: false });
        setIsComment(false);
        return;
      }
      socket.emit("typing-comment", { ...dataSocket, value: true });
      typingCommentTimeout.current = setTimeout(() => {
        socket.emit("typing-comment", { ...dataSocket, value: false });
      }, 1000);
    }
  };
  //#endregion
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: { xs: "0 10px", md: "0 40px" },
        }}
      >
        {replyComment && status === "authenticated" && (
          <RepCommentContent replyComment={replyComment} setReplyComment={setReplyComment} session={session} />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${theme.palette.card.borderColor.default}`,
            padding: "5px",
            borderRadius: "5px",
            gap: "5px",
          }}
        >
          <Form.Control
            as="textarea"
            value={comment}
            onChange={(e) => handleChangeComment(e.target.value)}
            placeholder={
              replyComment
                ? `Đang trả lời ${
                    session.user.account === replyComment.user[0].account ? "chính tôi" : replyComment.user[0].name
                  }`
                : "Nhập bình luận"
            }
            style={{
              height: "100px",
              fontSize: "2rem",
              background: theme.palette.mode === "dark" ? grey[900] : grey[50],
              color: theme.palette.mode === "dark" ? grey[300] : grey[900],
              border: isComment && comment.length < 5 ? "1px solid red" : "unset",
              "&:hover": {
                border: "unset",
              },
            }}
          />

          {isComment && comment.length < 5 && (
            <Typography sx={{ color: "#f44336" }}>Comment phải trên 5 kí tự</Typography>
          )}

          <Box
            sx={{
              display: "flex",
              marginTop: "5px",
              gap: "5px",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            <IconButton onClick={() => setIsOpenEmotionIcon(!isOpenEmotionIcon)}>
              <SentimentVerySatisfiedIcon />
            </IconButton>

            <Button
              variant="contained"
              disabled={isPostingComment || comment.length < 5 ? true : false}
              onClick={(e) => handleSubmitComment(e, replyComment ? replyComment.user[0]._id : null)}
            >
              Bình luận
            </Button>
          </Box>
          {isOpenEmotionIcon && <EmojiPickerData handleChangeComment={handleChangeComment} comment={comment} />}
        </Box>
      </Box>
      {isPostingComment && (
        <Box>
          <CircularProgress
            sx={{
              alignSelf: "center",
            }}
          />
        </Box>
      )}
    </>
  );
};
export default InputComment;
