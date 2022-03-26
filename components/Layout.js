import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDarkmode } from "../redux/actions";
import BackToTop from "./homePage/BackToTop";
import Footer from "./homePage/Footer";
import Navbar from "./homePage/Navbar";
import Sidebar from "./homePage/Sidebar";
import SidebarMobile from "./homePage/SidebarMobile";
import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.palette.background.default};
  }
  ::-webkit-scrollbar-thumb {
  background-color:  ${({ theme }) => theme.palette.iconColor.default};

  &:hover {
    background-color:  ${({ theme }) => theme.palette.iconColor.hover};
  }
}
`;

const getDesignTokens = (mode) => ({
  typography: {
    fontFamily: ["Noto Sans", "League Spartan", "Bebas Neue", "IBM Plex Sans", "Poppins", "sans-serif"].join(","),
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
            default: "#0e1217",
          }
        : {
            default: "#ffffff",
          }),
    },
    iconColor: {
      ...(mode === "dark"
        ? {
            default: "#a8b3cf",
            hover: "#ffffff",
          }
        : {
            default: "#525866",
            hover: "black",
          }),
    },
    avatar: {
      ...(mode === "dark"
        ? {
            default: "#a8b3cf",
            hover: "#ffffff",
          }
        : {
            default: "#525866",
            hover: "black",
          }),
    },
    header: {
      background: {
        ...(mode === "light"
          ? {
              default: "#ffffff",
            }
          : {
              default: "#0e1217",
            }),
      },
    },
    card: {
      borderColor: {
        ...(mode === "light"
          ? {
              default: "#a4a6a9",
              hover: "#19191a8a",
            }
          : {
              default: "#383d47",
              hover: "#a8b3cf66",
            }),
      },
      bgColor: {
        ...(mode === "light"
          ? {
              default: "#f5f8fc",
            }
          : {
              default: "#1c1f26",
            }),
      },
    },
    dialog: {
      borderColor: {
        ...(mode === "light"
          ? {
              default: "#1d1e1ec9",
              bottom: "#dcdee0",
            }
          : {
              default: "#707683c4",
              bottom: "#4b4c4e",
            }),
      },
      bgColor: {
        ...(mode === "light"
          ? {
              default: "#edf0f7",
            }
          : {
              default: "#17191f",
            }),
      },
      closeIcon: {
        ...(mode === "light"
          ? {
              default: "#525866",
            }
          : {
              default: "#a8b3cf",
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
  if (session && session.user.access_token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${session.user.access_token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);

  const getStatusDarkmode = useSelector((state) => state.getDarkmode);
  const dispatch = useDispatch();
  const handleClickSwitch = () => {
    dispatch(getDarkmode(!getStatusDarkmode));
  };
  const handleClickSidebarMobile = () => {
    setIsSidebarMobile(!isSidebarMobile);
  };

  useEffect(() => {
    const test = JSON.parse(localStorage.getItem("darkMode")) || false;
    dispatch(getDarkmode(test));
  }, []);
  const theme = createTheme(getDesignTokens(getStatusDarkmode ? "dark" : "light"));

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <Sidebar
          session={session}
          status={status}
          handleClickSidebarMobile={handleClickSidebarMobile}
          handleClickSwitch={handleClickSwitch}
        />
        <Navbar />
        {isSidebarMobile && (
          <SidebarMobile
            session={session}
            status={status}
            handleClickSidebarMobile={handleClickSidebarMobile}
            isSidebarMobile={isSidebarMobile}
          />
        )}

        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            paddingLeft: {
              xs: "0px",
              md: "90px",
            },
            position: "relative",
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
