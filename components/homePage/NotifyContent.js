import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Fade,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import convertToTime from "../../utils/convertTime";
import { memo } from "react";

const NotifyContent = (props) => {
  const { item, newContent, handleClickDelete, handleClickNotify } = props;
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

  return (
    <>
      {item && (
        <Box
          sx={{
            opacity: !item.status ? 1 : 0.6,
          }}
        >
          <ListItem button={true} className="box_notify">
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
              onClick={(e) => handleClickLinkNotify(e, item.link)}
              sx={{
                color: (theme) => theme.palette.iconColor.default,
              }}
              primary={newContent}
              secondary={convertToTime(item.createdAt)}
            ></ListItemText>
            <IconButton onClick={() => handleClickDelete(item._id)} className="button_notify">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </Box>
      )}
    </>
  );
};
export default memo(NotifyContent);
