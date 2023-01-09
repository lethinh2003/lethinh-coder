import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Avatar, Badge, Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
const ItemComment = (props) => {
  const { item, socket, postData, handleClickReplyComment, isChild = false, typePost } = props;
  const { data: session, status } = useSession();
  const elementsContent = item.content.split("\n");
  const [isLoading, setIsLoading] = useState(false);
  const [countLikes, setCountLikes] = useState(item.likes.length);
  const hostServer = process.env.ENDPOINT_SERVER;
  useEffect(() => {
    setCountLikes(item.likes.length);
  }, [item]);

  const BoxComment = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Noto Sans",
    marginLeft: isChild ? "50px" : "unset",
    marginBottom: !isChild ? "10px" : null,
    gap: "5px",
    borderRadius: "10px",
    padding: !isChild ? "10px" : null,
    // border: !isChild ? `1px solid ${theme.palette.card.borderColor.default}` : null,
    // backgroundColor: theme.palette.card.bgColor.default,

    "&:hover": {
      // border: !isChild ? `1px solid ${theme.palette.card.borderColor.hover}` : null,
    },
    "&::after": {
      top: "60px",
      backgroundColor: "rgb(161, 172, 185)",
      left: !isChild ? "30px" : "20px",
      width: "2px",
      height: "calc(((100% - 40px) - 20px) - 20px)",
      position: "absolute",
      content: item.childrenComment.length > 0 ? `""` : null,
      opacity: 0.5,
    },
    "&::before": {
      borderBottomLeftRadius: "50%",
      opacity: 0.5,
      top: "22px",
      backgroundColor: "rgb(161, 172, 185)",
      left: !isChild ? "30px" : "-28px",
      width: "20px",
      height: "2px",
      position: "absolute",
      content: isChild ? `""` : null,
    },
  }));

  //#region Các hàm sự kiện
  //Hàm like comment
  const handleClickLikeComment = async (commentId, accountId, receiveId, item) => {
    try {
      setIsLoading(true);
      const result = await axios.post(`${hostServer}/api/v1/comments/like`, {
        commentId: commentId,
        accountId: accountId,
        linkNotify: `/${typePost === "code" ? "source-code" : typePost}/${postData.slug}`,
      });

      const getListCommentsStorage = localStorage.getItem("listLikeComments");
      if (result.data.message === "like") {
        // Gửi thông báo cho chủ comment
        socket.emit("get-notify", receiveId);
        // Lưu trữ danh sách các comment đã like
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
      // Refetch lại comments
      socket.emit("refetch-comment-post", typePost === "blog" ? item.blog[0]._id : item.code[0]._id);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  // Kiểm tra xem user có like comment này chưa
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

  // Hàm xóa comment
  const handleClickDeleteComment = async (item) => {
    try {
      setIsLoading(true);
      await axios.post(`${hostServer}/api/v1/comments/delete`, {
        commentId: item._id,
      });

      setIsLoading(false);
      // Refetch lại comments
      socket.emit("refetch-comment-post", typePost === "blog" ? item.blog[0]._id : item.code[0]._id);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  //#endregion

  return (
    <>
      <BoxComment
        sx={{
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Box>
            <Link href={`/users/${item.user[0].account}`}>
              <Avatar
                sx={{
                  backgroundColor: (theme) => theme.palette.avatar.default,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                alt={item.user[0].name}
                src={item.user[0].avatar}
              >
                {item.user[0].name.charAt(0)}
              </Avatar>
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "calc(100% - 40px - 10px)",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {item.user[0].name} - {item.user[0].role === "admin" ? "Admin" : "Member"}
            </Typography>
            {elementsContent.map((itemm, i) => (
              <Typography key={i}>{itemm}</Typography>
            ))}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                paddingTop: "5px",
                color: "text.secondary",
              }}
            >
              <Typography
                sx={{
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                }}
              >
                <TimeAgo date={item.createdAt} />
              </Typography>
              {status === "authenticated" && (
                <Typography
                  sx={{
                    paddingLeft: "18px",
                    fontStyle: "italic",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickReplyComment(item)}
                >
                  Reply
                </Typography>
              )}
              {status === "authenticated" && session.user.id === item.user[0]._id && (
                <Typography
                  sx={{
                    paddingLeft: "18px",
                    fontStyle: "italic",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickDeleteComment(item)}
                >
                  Delete
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton
            size="large"
            aria-label="show likes"
            color="inherit"
            sx={{
              height: "50px",
            }}
            onClick={
              status === "authenticated"
                ? () => handleClickLikeComment(item._id, session.user.id, item.user[0]._id, item)
                : null
            }
          >
            <Badge badgeContent={countLikes} color="error">
              <ThumbUpAltIcon
                sx={{
                  color: checkLikedComment(item._id) ? "#2d82d6" : "inherit",
                }}
              />
            </Badge>
          </IconButton>
        </Box>

        {item &&
          item.childrenComment.length > 0 &&
          item.childrenComment.map((childItem, i) => (
            <ItemComment
              isChild={true}
              key={childItem._id}
              postData={postData}
              handleClickReplyComment={handleClickReplyComment}
              item={childItem}
              socket={socket}
              typePost={typePost}
            />
          ))}
      </BoxComment>
    </>
  );
};
export default memo(ItemComment);
