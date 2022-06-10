import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import convertTime from "../../utils/convertTime";
const ItemRepComment = (props) => {
  const { socket, sourceCode, replyItem, item: itemComment } = props;
  const { data: session, status } = useSession();
  useEffect(() => {
    setIsDelete(false);
  }, []);

  const elementsContent = replyItem.content.split("\n");
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countLikes, setCountLikes] = useState(0);
  const hostServer = process.env.ENDPOINT_SERVER;

  const handleClickDeleteRepComment = async (item) => {
    try {
      if (!session || !(session.user.id === item.user[0]._id)) {
        throw new Error("Co loi xay ra!");
      } else {
        setIsLoading(true);
        await axios.post(`${hostServer}/api/v1/reply-comments/delete`, {
          commentId: item._id,
        });
        // socket.emit("get-all-comments", sourceCode._id);
        const data = {
          id: item._id,
          room: itemComment._id,
        };
        socket.emit("delete-rep-comment", data);

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
        <Box sx={{ paddingLeft: "20px", opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? "none" : "auto" }}>
          <ListItem button={false}>
            <ListItemAvatar>
              <Link href={`/users/${replyItem.user[0].account}`}>
                <Avatar
                  sx={{
                    backgroundColor: (theme) => theme.palette.avatar.default,
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  alt={replyItem.user[0].name}
                  src={replyItem.user[0].avatar}
                >
                  {replyItem.user[0].name.charAt(0)}
                </Avatar>
              </Link>
            </ListItemAvatar>
            <ListItemText
              primary={`
                       ${replyItem.user[0].name} - ${replyItem.user[0].role === "admin" ? "Admin" : "Member"} `}
              secondary={replyItem.content}
            ></ListItemText>
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
                fontSize: "1.2rem",
              }}
            >
              {convertTime(replyItem.createdAt)}
            </Typography>
            {status === "authenticated" && session.user.id === replyItem.user[0]._id && (
              <Typography
                sx={{
                  paddingLeft: "18px",
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                onClick={() => handleClickDeleteRepComment(replyItem)}
              >
                Delete
              </Typography>
            )}
          </Typography>
        </Box>
      )}
    </>
  );
};
export default memo(ItemRepComment);
