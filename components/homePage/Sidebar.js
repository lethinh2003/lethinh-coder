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

const Sidebar = (props) => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuUser = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [isClickNotify, setIsClickNotify] = useState(false);

  const {
    session,
    status,
    handleClickSidebarMobile,
    handleClickOpenLogin,
    handleClickCloseLogin,
    handleClickLogout,
    handleClickOpenSignup,
    handleClickCloseSignup,
    theme,
    handleClickSwitch,
  } = props;
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClickLogoutMiddle = () => {
    handleClickLogout();
    handleCloseUserMenu();
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
        <Modal
          title={"Thông báo của bạn"}
          isModal={isModal}
          setIsClickNotify={setIsClickNotify}
          setIsModal={setIsModal}
        >
          {/* <FormControl fullWidth>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl> */}
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
        </Modal>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "header.background.default",
          padding: "10px",
          justifyContent: "space-between",
          color: "text.primary",
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          height: "70px",
        }}
      >
        <Typography
          sx={{
            paddingLeft: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
          component="div"
        >
          <Link href="/">
            <Button>
              <Avatar
                src="https://i.imgur.com/U0BdIic.png"
                variant="square"
                sx={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            </Button>
          </Link>
          <IconButton onClick={handleClickSidebarMobile}>
            <MenuIcon
              sx={{
                display: { xs: "block", md: "none" },
              }}
            />
          </IconButton>
          <Link href="/about-me">
            <Button
              sx={{
                fontWeight: "bold",
                height: "30px",
                padding: "5px",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              About me
            </Button>
          </Link>
          <Link href="/source-code">
            <Button
              sx={{
                fontWeight: "bold",
                height: "30px",
                padding: "5px",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              Source
            </Button>
          </Link>
        </Typography>
        <Typography
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}
          component="div"
        >
          <IconButton sx={{ ml: 1 }} onClick={handleClickSwitch} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
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
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => handleOpenUserMenu(e)}>
                  <Avatar alt={session.user.account}>{session.user.account.charAt(0)}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={isMenuUser}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Link href={"/users/" + session.user.account}>
                    <Typography textAlign="center">Profile</Typography>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center" onClick={handleClickLogoutMiddle}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
          {status !== "authenticated" && (
            <>
              <Button
                onClick={handleClickOpenLogin}
                sx={{
                  fontWeight: "bold",
                  height: "30px",
                  padding: "5px",
                  borderRadius: "10px",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                Login
              </Button>
              <Button
                onClick={handleClickOpenSignup}
                sx={{
                  fontWeight: "bold",
                  height: "30px",
                  padding: "5px",
                  borderRadius: "10px",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Typography>
      </Box>
    </>
  );
};
export default Sidebar;
