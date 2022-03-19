import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDarkmode } from "../redux/actions";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import BackToTop from "./homePage/BackToTop";
import Footer from "./homePage/Footer";
import Navbar from "./homePage/Navbar";
import Sidebar from "./homePage/Sidebar";
import SidebarMobile from "./homePage/SidebarMobile";

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
            default: "#edebeb",
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
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const getStatusDarkmode = useSelector((state) => state.getDarkmode);
  const dispatch = useDispatch();
  const handleClickSwitch = () => {
    dispatch(getDarkmode(!getStatusDarkmode));
  };
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
  useEffect(() => {
    const test = JSON.parse(localStorage.getItem("darkMode")) || false;
    dispatch(getDarkmode(test));
  }, []);
  const theme = createTheme(getDesignTokens(getStatusDarkmode ? "dark" : "light"));

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
        <BackToTop />
      </ThemeProvider>
    </>
  );
};
export default Layout;
