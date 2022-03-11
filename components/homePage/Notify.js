import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Badge,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Skeleton,
  useScrollTrigger,
} from "@mui/material";

import { useMemo, useState, useEffect } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SourceIcon from "@mui/icons-material/Source";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Modal from "./Modal";
import SearchIcon from "@mui/icons-material/Search";
import convertToTime from "../../utils/convertTime";
import axios from "axios";
import { useRouter } from "next/router";
import CancelIcon from "@mui/icons-material/Cancel";
const Notify = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [isClickNotify, setIsClickNotify] = useState(false);

  const { session, status } = props;

  const handleClose = () => {
    setIsModal(false);
    if (setIsClickNotify) {
      setIsClickNotify();
    }
  };

  const handleClickNotify = () => {
    setIsLoading(true);
    setData([]);
    if (!isClickNotify) {
      setIsClickNotify(true);
      setIsModal(true);
    } else {
      setIsClickNotify(false);
      setIsModal(false);
    }
  };

  useEffect(() => {
    if (isClickNotify) {
      const viewedNotify = async () => {
        try {
          await axios.post("/api/notify");
        } catch (err) {
          console.log(err);
        }
      };
      viewedNotify();
    }
    const fetchAPI = async () => {
      try {
        setNumberNotify(0);
        const results = await axios.get("/api/notify");

        const dataNotify = results.data.data;
        let notifyNum = 0;
        if (dataNotify.length > 0) {
          dataNotify.map((item) => {
            if (!item.status) {
              notifyNum += 1;
            }
          });
          setNumberNotify(notifyNum);
        }
        setData(dataNotify);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    if (status === "authenticated") {
      fetchAPI();
    }
  }, [isClickNotify, session, status]);
  const handleClickLinkNotify = (e, item) => {
    e.preventDefault();
    if (item) {
      router.push(item);
    }
    handleClickNotify();
  };
  return (
    <>
      {isClickNotify && (
        <Dialog open={isModal} onClose={handleClose}>
          <DialogTitle>{"Thông báo của bạn"}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ m: 1 }}>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {isLoading && (
                  <>
                    {Array.from({ length: 5 }).map((item, i) => (
                      <Skeleton key={i} variant="rectangular" width={"300px"} height={80} />
                    ))}
                  </>
                )}
                {!isLoading && data.length === 0 && <Typography>Thông báo trống</Typography>}
                {!isLoading &&
                  data.length > 0 &&
                  data.map((item, i) => (
                    <Box key={i}>
                      <ListItem button={true}>
                        <ListItemAvatar>
                          <Avatar alt={item.account_send[0].account}>{item.account_send[0].account.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          onClick={(e) => handleClickLinkNotify(e, item.link)}
                          primary={item.account_send[0].account}
                          secondary={item.content}
                        ></ListItemText>
                      </ListItem>
                      <Typography
                        sx={{
                          paddingLeft: "18px",
                          fontStyle: "italic",
                          fontSize: "12px",
                        }}
                      >
                        {convertToTime(item.createdAt)}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
export default Notify;
