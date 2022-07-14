import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { getDarkMode } from "../redux/actions/getDarkMode";
import BackToTop from "./homePage/BackToTop";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.palette.background.default};
  }
  pre {
    ${"" /* max-width: 700px; */}
    width: 100%;
    color: #ffffff;
    font-size: 2rem;
    padding: 1.5rem 1rem;
    overflow-x: auto;
    background-color: ${({ theme }) => theme.palette.background.preCode};

    code {
      color: #ffffff;
      background-color: unset;
      font-weight: 500;
      &:before, &:after
    {
      content: "";
    }

    }
  }

    code {
    font-weight: 600;

    color: ${({ theme }) => (theme.palette.mode === "dark" ? "#ffffff" : "#1b1b1b")};
    overflow-x: auto;
  

    &:before, &:after
    {
      content: "${"`"}";
    }
  } 
  ::-webkit-scrollbar-thumb {
  background-color:  ${({ theme }) => theme.palette.iconColor.default};

  &:hover {
    background-color:  ${({ theme }) => theme.palette.iconColor.hover};
  }
}
`;

const getDesignTokens = (mode) => ({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          fontSize: "1.4rem",
          borderRadius: "10px",
          textTransform: "capitalize",
          fontFamily: "Noto Sans",
          color: "#0b9ad1",
          fontWeight: "bold",
          backgroundColor: "#fff",
          border: "1px solid #0b9ad1",

          "&.Mui-disabled": {
            color: "#0b9ad18c",
          },
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#fff",
            borderColor: "#005cbf",
          },

          "&:focus": {
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
          },
        }),
      },
    },
  },
  typography: {
    fontSize: 25,
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
            preCode: "#000000",
          }
        : {
            default: "#ffffff",
            preCode: "#000000",
          }),
    },
    navItem: {
      ...(mode === "dark"
        ? {
            background: "#0e1217",
            hover: "#20262d",
            active: "#20262d",
          }
        : {
            background: "#ffffff",
            hover: "#eaebec",
            active: "#eaebec",
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

const ThemeLayout = (props) => {
  const getStatusDarkmode = useSelector((state) => state.darkMode.on);

  console.log(getStatusDarkmode);
  const dispatch = useDispatch();
  useEffect(() => {
    const test = JSON.parse(localStorage.getItem("darkMode")) || false;
    dispatch(getDarkMode(test));
  }, []);
  const theme = createTheme(getDesignTokens(getStatusDarkmode ? "dark" : "light"));

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        {props.children}
        <BackToTop />
      </ThemeProvider>
    </>
  );
};
export default ThemeLayout;
