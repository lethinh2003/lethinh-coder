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
  Slide,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SourceIcon from "@mui/icons-material/Source";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { FaHome } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLogoutCircleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
const SidebarMobile = (props) => {
  const {
    status,
    handleClickSidebarMobile,
    isSidebarMobile,
    handleClickOpenLogin,
    handleClickLogout,
    handleClickOpenSignup,
    handleClickCloseSignup,
    handleClickSwitch,
  } = props;
  const theme = useTheme();
  const router = useRouter();
  const menuWrapper = useRef();
  const handleClickOutSide = (e) => {
    if (!menuWrapper.current.contains(e.target)) {
      handleClickSidebarMobile();
    }
  };
  const handleClickOpenLoginMiddle = () => {
    handleClickSidebarMobile();
    handleClickOpenLogin();
  };
  const handleClickOpenSignupMiddle = () => {
    handleClickSidebarMobile();
    handleClickOpenSignup();
  };
  return (
    <>
      <Box
        onClick={(e) => handleClickOutSide(e)}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,.5)",
          zIndex: 1001,
        }}
      >
        <Slide direction="right" in={isSidebarMobile} mountOnEnter unmountOnExit>
          <Box
            ref={menuWrapper}
            sx={{
              position: "absolute",
              backgroundColor: "sidebarMobile.background.default",
              height: "100vh",
              width: "300px",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Link href="/">
                <Button
                  onClick={handleClickSidebarMobile}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "5px",
                    fontSize: "25px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                  component="div"
                  className={router.pathname === "/" ? `active_${theme.palette.mode}` : "thinhs"}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <FaHome style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: "20px",
                    }}
                  >
                    Home
                  </div>
                </Button>
              </Link>
              {status !== "authenticated" && (
                <>
                  <Button
                    onClick={handleClickOpenLoginMiddle}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                  >
                    <AiOutlineLogin style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Login
                    </Typography>
                  </Button>
                  <Button
                    onClick={handleClickOpenSignupMiddle}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                  >
                    <AiOutlineLogin style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Sign up
                    </Typography>
                  </Button>
                </>
              )}
              {status === "authenticated" && (
                <>
                  <Button
                    onClick={handleClickLogout}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                  >
                    <RiLogoutCircleLine style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Logout
                    </Typography>
                  </Button>
                </>
              )}
              <Link href="/about-me">
                <Button
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "5px",
                    fontSize: "25px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                  component="div"
                >
                  <CgProfile style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                  <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                    About me
                  </Typography>
                </Button>
              </Link>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "5px",
                  fontSize: "25px",
                  fontWeight: "bold",
                  padding: "5px",
                }}
                component="div"
              >
                <SourceIcon sx={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                  Source
                </Typography>
              </Button>
            </Box>
          </Box>
        </Slide>
      </Box>
    </>
  );
};
export default SidebarMobile;
