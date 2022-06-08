import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Avatar, Badge, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import convertTime from "../../utils/convertTime";
import { memo } from "react";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
const ItemComment = (props) => {
  // const blogData = "lethinhpro";
  const { item, socket, blogData, handleClickReplyComment } = props;
  const { data: session, status } = useSession();

  const elementsContent = item.content.split("\n");
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countLikes, setCountLikes] = useState(0);
  const hostServer = process.env.ENDPOINT_SERVER;
  useEffect(() => {
    setIsDelete(false);
    setCountLikes(item.likes.length);
    console.log("re-render", item._id);
    socket.emit("join-room-comment-id", item._id);
    socket.on("update-count-likes", (data) => {
      if (data.id === item._id) {
        setCountLikes((prev) => prev + data.num);
      }
    });
    socket.on("delete-comment", (data) => {
      if (data.id === item._id) {
        setIsDelete(true);
      }
    });
    return () => {
      socket.off("update-count-likes");
      socket.off("delete-comment");
    };
  }, [item]);

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

  const handleClickLikeComment = async (commentId, accountId, receiveId) => {
    if (status === "authenticated") {
      try {
        setIsLoading(true);
        const result = await axios.post(`${hostServer}/api/v1/comments/like`, {
          commentId: commentId,
          accountId: accountId,
          linkNotify: `/blog/${blogData.slug}`,
        });
        socket.emit("send-room-history-likes", session.user.id);

        const getListCommentsStorage = localStorage.getItem("listLikeComments");
        if (result.data.message === "like") {
          const data = {
            id: item._id,
            num: 1,
          };
          socket.emit("update-count-likes", data);

          socket.emit("get-notify", receiveId);
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
          const data = {
            id: item._id,
            num: -1,
          };
          socket.emit("update-count-likes", data);

          let convertToArray = JSON.parse(getListCommentsStorage);
          const filterArray = convertToArray.filter((item) => item !== commentId);
          localStorage.setItem("listLikeComments", JSON.stringify(filterArray));
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
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

  const handleClickDeleteComment = async (item) => {
    try {
      if (!session || !(session.user.id === item.user[0]._id)) {
        throw new Error("Co loi xay ra!");
      } else {
        setIsLoading(true);
        await axios.post(`${hostServer}/api/v1/comments/delete`, {
          commentId: item._id,
        });
        // socket.emit("get-all-comments", blogData._id);
        const data = {
          id: item._id,
        };
        socket.emit("delete-comment", data);
        setIsDelete(true);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <>
      {!isDelete && (
        <BoxComment
          sx={{
            opacity: isLoading ? 0.6 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <ListItem button={false} sx={{}}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  backgroundColor: (theme) => theme.palette.avatar.default,
                  borderRadius: "10px",
                }}
                alt={item.user[0].name}
                src={item.user[0].avatar}
              >
                {item.user[0].name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {item.user[0].name} - {item.user[0].role === "admin" ? "Admin" : "Member"}
                </Typography>
              }
              secondary={elementsContent.map((itemm, i) => (
                <Typography key={i}>{itemm}</Typography>
              ))}
            ></ListItemText>

            <IconButton
              size="large"
              aria-label="show likes"
              color="inherit"
              onClick={
                status === "authenticated"
                  ? () => handleClickLikeComment(item._id, session.user.id, item.user[0]._id)
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
            {status === "authenticated" && session.user.id === item.user[0]._id && (
              <Typography
                sx={{
                  paddingLeft: "18px",
                  fontStyle: "italic",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                onClick={() => handleClickDeleteComment(item)}
              >
                Delete
              </Typography>
            )}
          </Typography>

          {item.reply.length > 0 &&
            item.reply.map((replyItem) => (
              <Box key={replyItem._id} sx={{ paddingLeft: "20px" }}>
                <ListItem button={false}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: (theme) => theme.palette.avatar.default,
                      }}
                      alt={replyItem.user[0].name}
                      src={replyItem.user[0].avatar}
                    >
                      {replyItem.user[0].name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${replyItem.user[0].name} - ${replyItem.user[0].role === "admin" ? "Admin" : "Member"} `}
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
        </BoxComment>
      )}
    </>
  );
};
export default memo(ItemComment);
