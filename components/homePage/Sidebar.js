import { useTheme } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSystem } from "../../redux/actions/getSystem";
import AvatarProfile from "./AvatarProfile";
import Notify from "./Notify";
const Sidebar = (props) => {
  const { status, handleClickSidebarMobile, handleClickSwitch } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const dataSystem = useSelector((state) => state.system.data);
  useEffect(() => {
    if (!dataSystem) {
      dispatch(getSystem());
    }
  }, []);

  const LoginButton = styled(Button)({
    boxShadow: "none",
    fontSize: "1.4rem",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#ebf0fe",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#ebf0fe",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const BoxMenuSideBar = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.header.background.default,
    padding: "10px",
    justifyContent: "space-between",
    position: "fixed",
    zIndex: 1000,
    width: "100%",
    height: "70px",
    borderBottom: theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e",
  }));
  const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
    ({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            backgroundColor: theme.palette.avatar.default,
            opacity: 1,
            border: 0,
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.5,
          },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
          color: "#33cf4d",
          border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
          color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
      },
      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
      },
      "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.avatar.default,
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
          duration: 500,
        }),
      },
    })
  );

  return (
    <>
      <BoxMenuSideBar>
        <Typography
          sx={{
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
          component="div"
        >
          <Link href="/">
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                  width: "50px",
                  height: "50px",
                  position: "relative",
                  cursor: "pointer",
                },
              }}
            >
              <Image
                src={"https://i.imgur.com/U0BdIic.png"}
                layout="fill"
                alt={dataSystem ? dataSystem.meta_title : "Le Thinh Blog"}
              />
            </Box>
          </Link>
          <IconButton onClick={handleClickSidebarMobile}>
            <MenuIcon
              sx={{
                display: { xs: "block", md: "none" },
              }}
            />
          </IconButton>
        </Typography>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            paddingRight: "10px",
          }}
          component="div"
        >
          <IOSSwitch sx={{ m: 1 }} onClick={handleClickSwitch} checked={theme.palette.mode === "dark" ? true : false} />
          {status === "authenticated" && (
            <>
              <Notify />

              <AvatarProfile />
            </>
          )}
          {status === "unauthenticated" && (
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
      </BoxMenuSideBar>
    </>
  );
};
export default Sidebar;
