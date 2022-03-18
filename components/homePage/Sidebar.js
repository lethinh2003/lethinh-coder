import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar, Badge, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Notify from "./Notify";
import { styled } from "@mui/material/styles";

const Sidebar = (props) => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuUser = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [numberNotify, setNumberNotify] = useState(0);
  const [isModal, setIsModal] = useState(false);

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
  const LoginButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });

  return (
    <>
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
          <Link href="/#">
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
          <Notify />

          {status === "authenticated" && (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => handleOpenUserMenu(e)}>
                  <Avatar alt={session.user.account} src={session.user.avatar}>
                    {session.user.account.charAt(0)}
                  </Avatar>
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
              <Link href="/login">
                <LoginButton
                  sx={{
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  Login
                </LoginButton>
              </Link>
              <Link href="/signup">
                <LoginButton
                  sx={{
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  Signup
                </LoginButton>
              </Link>
            </>
          )}
        </Typography>
      </Box>
    </>
  );
};
export default Sidebar;
