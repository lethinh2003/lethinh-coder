import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Skeleton,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import convertToTime from "../../utils/convertTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import socketIOClient from "socket.io-client";
import DeleteIcon from "@mui/icons-material/Delete";
let socket;
const Notify = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClickNotify, setIsClickNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataNoti, setDataNoti] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);

  useEffect(() => socketInitializer(), [status]);
  const socketInitializer = () => {
    socket = socketIOClient.connect(process.env.HOST_SOCKET);
    if (status === "authenticated") {
      socket.emit("join-notify", session.user.id);
      socket.emit("get-notify", session.user.id);
      socket.on("send-notify", (data) => {
        let notifyNum = 0;
        if (data.length > 0) {
          data.map((item) => {
            if (!item.status) {
              notifyNum += 1;
            }
          });
          setNumberNotify(notifyNum);
        }
      });
      socket.on("read-notify", () => {
        setNumberNotify(0);
      });
    }
  };
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        setDataNoti([]);

        const results = await axios.get("/api/notify");
        // setNumberNotify(0);
        socket.emit("read-notify", session.user.id);
        const dataNotify = results.data.data;
        // let notifyNum = 0;
        // if (dataNotify.length > 0) {
        //   dataNotify.map((item) => {
        //     if (!item.status) {
        //       notifyNum += 1;
        //     }
        //   });
        //   setNumberNotify(notifyNum);
        // }
        setDataNoti(dataNotify);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    if (status === "authenticated" && isClickNotify) {
      fetchAPI();
    }
  }, [isClickNotify, status]);
  const handleClose = () => {
    setIsClickNotify(false);
  };

  const handleClickNotify = () => {
    setIsLoading(true);
    setDataNoti([]);
    setIsClickNotify(!isClickNotify);
  };

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
      {status === "authenticated" && (
        <>
          <IconButton
            onClick={() => handleClickNotify()}
            size="large"
            aria-label="show new notifications"
            color="inherit"
          >
            <Badge badgeContent={numberNotify} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Dialog open={isClickNotify} onClose={handleClose}>
            <DialogTitle>{"Thông báo của bạn"}</DialogTitle>
            <DialogContent
              sx={{
                padding: "20px 10px",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {isLoading && (
                    <>
                      {Array.from({ length: 5 }).map((item, i) => (
                        <Skeleton key={i} variant="rectangular" width={"300px"} height={80} />
                      ))}
                    </>
                  )}
                  {!isLoading && dataNoti.length === 0 && <Typography>Thông báo trống</Typography>}
                  {!isLoading &&
                    dataNoti.length > 0 &&
                    dataNoti.map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          opacity: !item.status ? 1 : 0.6,
                        }}
                      >
                        <ListItem button={true} className="box_notify">
                          <ListItemAvatar>
                            <Avatar alt={item.account_send[0].account}>{item.account_send[0].account.charAt(0)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            onClick={(e) => handleClickLinkNotify(e, item.link)}
                            primary={item.content}
                            secondary={convertToTime(item.createdAt)}
                          ></ListItemText>
                          <IconButton onClick={() => handleClickDelete(item._id)} className="button_notify">
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      </Box>
                    ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};
export default Notify;