import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BookIcon from "@mui/icons-material/Book";
import HomeIcon from "@mui/icons-material/Home";
import InputIcon from "@mui/icons-material/Input";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SourceIcon from "@mui/icons-material/Source";
import { Box, Fade, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

const SidebarMobile = ({ isSidebarMobile, setIsSidebarMobile, handleClickSidebarMobile }) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef();
  const [value, setValue] = useState("/");
  useEffect(() => {
    if (router.pathname === "/") {
      setValue("/");
    } else if (router.pathname.startsWith("/source-code")) {
      setValue("/source-code");
    } else if (router.pathname.startsWith("/blog")) {
      setValue("/blog");
    } else if (router.pathname.startsWith("/admin")) {
      setValue("/admin");
    } else {
      setValue(router.pathname);
    }
  }, [router.pathname]);

  const menuOption = [
    {
      key: "/",
      title: "Home",
      type: 0,
      icon: <HomeIcon />,
    },
    {
      key: "/source-code",
      title: "Source",
      type: 0,
      icon: <SourceIcon />,
    },
    {
      key: "/blog",
      title: "Blog",
      type: 0,
      icon: <BookIcon />,
    },
    {
      key: "/login",
      title: "Login",
      type: 1,
      icon: <LoginIcon />,
    },
    {
      key: "/signup",
      title: "Signup",
      type: 1,
      icon: <InputIcon />,
    },
    {
      key: "/logout",
      title: "Logout",
      type: 2,
      icon: <LogoutIcon />,
    },
    {
      key: "/admin",
      title: "Admin",
      type: 3,
      icon: <AdminPanelSettingsIcon />,
    },
  ];
  const handleClickOutside = () => {
    handleClickSidebarMobile();
  };
  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      <Fade in={isSidebarMobile}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "#00000078",
            zIndex: 99999,
          }}
        >
          <Slide direction="right" in={isSidebarMobile} mountOnEnter unmountOnExit>
            <Box
              ref={ref}
              sx={{
                position: "fixed",
                backgroundColor: (theme) => theme.palette.sidebarMobile.background.default,
                height: "100vh",
                width: "300px",
                padding: "20px",
                zIndex: 1001,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",

                  color: (theme) => theme.palette.text.first,
                }}
              >
                {menuOption.map((item, i) => {
                  if (item.type === 0) {
                    return (
                      <Link href={item.key} key={item.key}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "5px",
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            padding: "5px",
                            textTransform: "capitalize",

                            backgroundColor:
                              value === item.key
                                ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                                : null,
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",

                            "&:hover": {
                              backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: "1.5rem",
                              marginRight: "5px",
                            }}
                          >
                            {item.icon}
                          </Box>

                          <Typography
                            sx={{
                              display: "flex",
                              fontSize: "2rem",
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                      </Link>
                    );
                  } else if (item.type === 1) {
                    if (status === "unauthenticated") {
                      return (
                        <Link href={item.key} key={item.key}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "5px",
                              fontSize: "2.5rem",
                              fontWeight: "bold",
                              padding: "5px",
                              textTransform: "capitalize",

                              backgroundColor:
                                value === item.key
                                  ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                                  : null,
                              padding: "10px",
                              borderRadius: "5px",
                              cursor: "pointer",

                              "&:hover": {
                                backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "1.5rem",
                                marginRight: "5px",
                              }}
                            >
                              {item.icon}
                            </Box>

                            <Typography
                              sx={{
                                display: "flex",
                                fontSize: "2rem",
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        </Link>
                      );
                    }
                  } else if (item.type === 2) {
                    if (status === "authenticated") {
                      return (
                        <Link href={item.key} key={item.key}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "5px",
                              fontSize: "2.5rem",
                              fontWeight: "bold",
                              padding: "5px",
                              textTransform: "capitalize",

                              backgroundColor:
                                value === item.key
                                  ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                                  : null,
                              padding: "10px",
                              borderRadius: "5px",
                              cursor: "pointer",

                              "&:hover": {
                                backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "1.5rem",
                                marginRight: "5px",
                              }}
                            >
                              {item.icon}
                            </Box>

                            <Typography
                              sx={{
                                display: "flex",
                                fontSize: "2rem",
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        </Link>
                      );
                    }
                  } else if (item.type === 3) {
                    if (status === "authenticated" && session.user.role === "admin") {
                      return (
                        <Link href={item.key} key={item.key}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "5px",
                              fontSize: "2.5rem",
                              fontWeight: "bold",
                              padding: "5px",
                              textTransform: "capitalize",

                              backgroundColor:
                                value === item.key
                                  ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                                  : null,
                              padding: "10px",
                              borderRadius: "5px",
                              cursor: "pointer",

                              "&:hover": {
                                backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "1.5rem",
                                marginRight: "5px",
                              }}
                            >
                              {item.icon}
                            </Box>

                            <Typography
                              sx={{
                                display: "flex",
                                fontSize: "2rem",
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        </Link>
                      );
                    }
                  }
                })}
              </Box>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </>
  );
};
export default SidebarMobile;
