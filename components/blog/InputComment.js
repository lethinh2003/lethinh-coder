import InputUnstyled from "@mui/base/InputUnstyled";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useRef, useState, useEffect } from "react";
import SocketContext from "../../context/socket";
import RepCommentContent from "./RepCommentContent";
import { toast } from "react-toastify";
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

const StyledInputElement = styled("input")(
  ({ theme }) => `
    width: 320px;
    font-size: 0.875rem;
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    line-height: 1.5;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
    border-radius: 8px;
    padding: 12px 12px;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? "" : grey[100]};
      border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
    }
  
    &:focus {
      outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
    }
  `
);

const StyledTextareaElement = styled("textarea")(
  ({ theme }) => `
    width: 320px;
    font-size: 0.875rem;
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    line-height: 1.5;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
    border-radius: 8px;
    padding: 12px 12px;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? "" : grey[100]};
      border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
    }
  
    &:focus {
      outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
    }
  `
);

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return (
    <InputUnstyled components={{ Input: StyledInputElement, Textarea: StyledTextareaElement }} {...props} ref={ref} />
  );
});

const InputComment = (props) => {
  const socket = useContext(SocketContext);
  const { data: session, status } = useSession();
  const { blogData, replyComment, setReplyComment } = props;

  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const inputComment = useRef();
  const hostServer = process.env.ENDPOINT_SERVER;
  useEffect(() => {
    setIsComment(false);
    setComment("");
  }, [blogData]);
  const BoxComment = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    fontFamily: "Noto Sans",

    marginBottom: "10px",

    borderRadius: "10px",
    padding: "5px 0px",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,

    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));

  const handleSubmitComment = async (e, receiveId) => {
    e.preventDefault();
    if (comment.length >= 5 && isComment) {
      try {
        setIsPostingComment(true);
        if (!replyComment) {
          const result = await axios.post(`${hostServer}/api/v1/comments/detail/` + blogData._id, {
            content: comment,
            type: "blog",
          });
        } else {
          const result = await axios.post(`${hostServer}/api/v1/comments/reply`, {
            commentId: replyComment._id,
            content: comment,
            linkNotify: `/blog/${blogData.slug}`,
          });
          socket.emit("get-notify", receiveId);
          setReplyComment(null);
        }
        setComment("");
        setIsComment(false);

        setIsPostingComment(false);
        socket.emit("get-all-comments", blogData._id);
      } catch (err) {
        setIsPostingComment(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  };
  const handleChangeComment = (e) => {
    if (!isPostingComment) {
      // socket.emit("typing-comment", blogData[0]._id);
      setIsComment(true);
      setComment(e.target.value);
    }
  };

  const handleClickCancelReply = () => {
    if (!isPostingComment) {
      setReplyComment(null);
    }
  };

  return (
    <>
      {replyComment && status === "authenticated" && (
        <RepCommentContent replyComment={replyComment} setReplyComment={setReplyComment} session={session} />
      )}

      <form
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          gap: "5px",
        }}
        onSubmit={(e) => handleSubmitComment(e, replyComment ? replyComment.user[0]._id : null)}
      >
        <CustomInput
          multiline
          ref={inputComment}
          disabled={status === "authenticated" ? false : true}
          value={comment}
          placeholder={
            replyComment
              ? `Đang trả lời ${
                  session.user.account === replyComment.user[0].account ? "chính tôi" : replyComment.user[0].name
                }`
              : "Nhập bình luận"
          }
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
          <Button
            variant="contained"
            disabled={comment.length < 5 ? true : false}
            onClick={(e) => handleSubmitComment(e, replyComment ? replyComment.user[0]._id : null)}
          >
            Bình luận
          </Button>
        )}
      </form>
    </>
  );
};
export default InputComment;
