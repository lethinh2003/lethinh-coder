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
let socket;

const NotifyContent = (props) => {
  const { dataNoti, isLoading, isError, messageError, handleClickNotify, setDataNoti } = props;
  const router = useRouter();

  const handleClickLinkNotify = (e, item) => {
    e.preventDefault();
    if (item) {
      router.push(item);
    }
    handleClickNotify();
  };

  const handleClickDelete = async (id) => {
    try {
      await axios.post("/api/notify", {
        notifyId: id,
      });
      const newArray = [...dataNoti];
      const newArrayRemoveItem = newArray.filter((item) => item._id !== id);
      setDataNoti(newArrayRemoveItem);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {isLoading &&
          Array.from({ length: 4 }).map((item, i) => (
            <ListItem
              button={true}
              key={i}
              sx={{
                maxWidth: "400px",
                width: "100vw",
              }}
            >
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText>
                <Skeleton variant="text" height={70} />
                <Skeleton variant="text" width={100} />
              </ListItemText>
            </ListItem>
          ))}
        {isError && (
          <Fade in={isError}>
            <Alert
              sx={{
                maxWidth: "400px",
                width: "100%",
                borderRadius: "20px",
                border: "1px solid #914b31",
              }}
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              {messageError} — <strong>try again!</strong>
            </Alert>
          </Fade>
        )}
        {!isLoading && dataNoti.length === 0 && !isError && (
          <Typography
            sx={{
              maxWidth: "400px",
              width: "100vw",
              textAlign: "center",
            }}
          >
            Thông báo trống
          </Typography>
        )}
        {!isLoading &&
          dataNoti.length > 0 &&
          dataNoti.map((item, i) => {
            let newContent = item.content;
            const content = item.content;
            if (content.includes("{name}")) {
              newContent = newContent.replace("{name}", item.account_send[0].name);
            }

            return (
              <Box
                key={i}
                sx={{
                  opacity: !item.status ? 1 : 0.6,
                }}
              >
                <ListItem button={true} className="box_notify">
                  <ListItemAvatar>
                    <Avatar alt={item.account_send[0].name} src={item.account_send[0].avatar}>
                      {item.account_send[0].name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    onClick={(e) => handleClickLinkNotify(e, item.link)}
                    primary={newContent}
                    secondary={convertToTime(item.createdAt)}
                  ></ListItemText>
                  <IconButton onClick={() => handleClickDelete(item._id)} className="button_notify">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              </Box>
            );
          })}
      </Box>
    </>
  );
};
export default NotifyContent;
