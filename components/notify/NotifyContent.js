import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import convertToTime from "../../utils/convertTime";

const NotifyContent = (props) => {
  const { item, newContent, handleClickNotify, refetch } = props;
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const router = useRouter();

  const handleClickLinkNotify = (e, item) => {
    e.preventDefault();
    if (item) {
      router.push(item);
    }
    if (handleClickNotify) {
      handleClickNotify();
    }
  };
  const handleClickDelete = async (id) => {
    try {
      setIsLoadingDelete(true);
      await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/notifies/delete`, {
        notifyId: id,
      });
      await refetch();
      setIsLoadingDelete(false);
    } catch (err) {
      setIsLoadingDelete(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          opacity: !item.status ? 1 : 0.6,
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
          className="box_notify"
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                backgroundColor: (theme) => theme.palette.avatar.default,
                borderRadius: "10px",
              }}
              alt={item.account_send[0].name}
              src={item.account_send[0].avatar}
            >
              {item.account_send[0].name.charAt(0)}
            </Avatar>
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
                onClick={(e) => handleClickLinkNotify(e, item.link)}
              >
                {newContent}
              </Typography>
            }
            secondary={convertToTime(item.createdAt)}
          ></ListItemText>
          <IconButton onClick={() => handleClickDelete(item._id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </Box>
    </>
  );
};
export default memo(NotifyContent);
