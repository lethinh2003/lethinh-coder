import Sidebar from "./homePage/Sidebar";
import SidebarMobile from "./homePage/SidebarMobile";
import Navbar from "./homePage/Navbar";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Head from "next/head";
import Image from "next/image";

import axios from "axios";
import Link from "next/link";
import { green, orange, purple, amber, deepOrange, grey } from "@mui/material/colors";
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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SourceIcon from "@mui/icons-material/Source";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Footer from "./homePage/Footer";

const getDesignTokens = (mode) => ({
  typography: {
    fontFamily: ["League Spartan", "Bebas Neue", "IBM Plex Sans", "Poppins", "Noto Sans", "sans-serif"].join(","),
  },
  palette: {
    mode,
    primary: {
      ...(mode === "dark"
        ? {
            main: "#f9f7f0",
          }
        : {
            main: "#080808",
          }),
    },
    background: {
      ...(mode === "dark"
        ? {
            default: "#161515",
          }
        : {
            default: "#f5f4f4",
          }),
    },

    header: {
      background: {
        ...(mode === "light"
          ? {
              default: "#ffffff",
            }
          : {
              default: "#020000",
            }),
      },
    },
    sidebarMobile: {
      background: {
        ...(mode === "light"
          ? {
              default: "#ffffff",
            }
          : {
              default: "#201f1f",
            }),
      },
    },
    button: {
      codeFree: "#f5e128",
      codeNotFree: "#21a6c1",
    },
    text: {
      ...(mode === "light"
        ? {
            primary: grey[900],
            secondary: grey[800],
          }
        : {
            primary: "#fff",
            secondary: grey[500],
          }),
    },
  },
});

const Layout = (props) => {
  const { data: session, status } = useSession();

  const [isDarkMode, SetIsDarkMore] = useState(false);
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isSignupModal, setIsSignupModal] = useState(false);

  useEffect(() => {
    const getStatusTheme = localStorage.getItem("darkMore");
    if (getStatusTheme) {
      SetIsDarkMore(JSON.parse(getStatusTheme));
    }
  }, []);

  const handleClickSwitch = () => {
    SetIsDarkMore(!isDarkMode);
    localStorage.setItem("darkMore", !isDarkMode);
  };
  const theme = createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
  const handleClickSidebarMobile = () => {
    setIsSidebarMobile(!isSidebarMobile);
  };
  const handleClickOpenLogin = () => {
    setIsLoginModal(true);
  };
  const handleClickCloseLogin = () => {
    setIsLoginModal(false);
  };
  const handleClickOpenSignup = () => {
    setIsSignupModal(true);
  };
  const handleClickCloseSignup = () => {
    setIsSignupModal(false);
  };
  const handleClickLogout = async () => {
    const data = await signOut({
      redirect: false,
    });
    localStorage.removeItem("listLikeComments");
  };
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Sidebar
          session={session}
          status={status}
          handleClickSidebarMobile={handleClickSidebarMobile}
          handleClickOpenLogin={handleClickOpenLogin}
          handleClickCloseLogin={handleClickCloseLogin}
          handleClickOpenSignup={handleClickOpenSignup}
          handleClickCloseSignup={handleClickCloseSignup}
          handleClickLogout={handleClickLogout}
          handleClickSwitch={handleClickSwitch}
          theme={theme}
        />
        <Navbar />
        {isSidebarMobile && (
          <SidebarMobile
            status={status}
            handleClickSidebarMobile={handleClickSidebarMobile}
            isSidebarMobile={isSidebarMobile}
            handleClickOpenSignup={handleClickOpenSignup}
            handleClickCloseSignup={handleClickCloseSignup}
            handleClickOpenLogin={handleClickOpenLogin}
            handleClickCloseLogin={handleClickCloseLogin}
            handleClickLogout={handleClickLogout}
            handleClickSwitch={handleClickSwitch}
          />
        )}
        {isLoginModal && status !== "authenticated" && (
          <Login isLoginModal={isLoginModal} setIsLoginModal={setIsLoginModal} status={status} />
        )}
        {isSignupModal && status !== "authenticated" && (
          <Signup isSignupModal={isSignupModal} setIsSignupModal={setIsSignupModal} status={status} />
        )}
        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            paddingLeft: {
              xs: "0px",
              md: "90px",
            },
          }}
          className="box-container"
        >
          {props.children}
          <Footer />
        </Box>
        <Zoom in={trigger}>
          <Fab
            color="success"
            sx={{
              position: "fixed",

              borderRadius: "50%",
              margin: "10px",
              bottom: "0",
              right: "0",
            }}
            onClick={scrollToTop}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>
      </ThemeProvider>
    </>
  );
};
export default Layout;