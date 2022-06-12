import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import convertToTime from "../../utils/convertTime";
import { memo } from "react";
const RepCommentContent = ({ user, socket, item, newContent }) => {
  const router = useRouter();

  const hostServer = process.env.ENDPOINT_SERVER;
  const { data: session, status } = useSession();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleClickDelete = async (id, postId) => {
    try {
      setIsLoadingDelete(true);

      await axios.post(`${hostServer}/api/v1/reply-comments/delete`, {
        commentId: id,
      });
      const data = {
        id: item._id,
        room: item.comment[0]._id,
      };
      socket.emit("delete-rep-comment", data);
      // socket.emit("get-all-comments", postId);

      setIsDelete(true);
      setIsLoadingDelete(false);
    } catch (err) {
      setIsLoadingDelete(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const handleClickLinkComment = (item) => {
    if (item && item.comment[0].code[0]) {
      router.push(`/source-code/${item.comment[0].code[0].slug}`);
    } else if (item && item.comment[0].blog[0]) {
      router.push(`/blog/${item.comment[0].blog[0].slug}`);
    }
  };
  return (
    <>
      {!isDelete && (
        <Box
          sx={{
            opacity: isLoadingDelete ? 0.7 : 1,
            pointerEvents: isLoadingDelete ? "none" : "auto",
          }}
        >
          <ListItem
            sx={{
              borderRadius: "20px",
              border: (theme) => `1px solid ${theme.palette.card.borderColor.default}`,
              backgroundColor: (theme) => theme.palette.card.bgColor.default,
              "&:hover": {
                border: (theme) => `1px solid ${theme.palette.card.borderColor.hover}`,
              },
            }}
            button={false}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  backgroundColor: (theme) => theme.palette.avatar.default,
                  borderRadius: "10px",
                }}
                alt={item.comment[0].code[0] ? item.comment[0].code[0].title : item.comment[0].blog[0].title}
                src={item.comment[0].code[0] ? item.comment[0].code[0].images[0] : item.comment[0].blog[0].images[0]}
              ></Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: (theme) => theme.palette.iconColor.default,
              }}
              primary={
                <Typography
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleClickLinkComment(item)}
                >
                  {newContent}
                </Typography>
              }
              secondary={convertToTime(item.createdAt)}
            ></ListItemText>
            {session && session.user && user.account === session.user.account && (
              <IconButton
                onClick={() =>
                  handleClickDelete(
                    item._id,
                    item.comment[0].code[0] ? item.comment[0].code[0]._id : item.comment[0].blog[0]._id
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        </Box>
      )}
    </>
  );
};
export default memo(RepCommentContent);
