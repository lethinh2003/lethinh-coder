import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AttachmentIcon from "@mui/icons-material/Attachment";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaBlog } from "react-icons/fa";

const Navbar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const handleClickSupport = () => {
    setIsModal(true);
  };

  const BoxMenuNavBar = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.header.background.default,

    borderRight: theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e",
  }));

  return (
    <>
      <BoxMenuNavBar
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
        }}
        className="ms-sidebar"
      >
        <Typography
          className="ms-sidebar__wrapper"
          component="div"
          sx={{
            bgcolor: "header.background.default",
            color: "text.primary",
          }}
        >
          <Typography
            className="ms-navbar"
            component="div"
            sx={{
              bgcolor: "header.background.default",
              color: "text.primary",
            }}
          >
            <Link href="/">
              <Button
                className={router.pathname === "/" ? `ms-navbar__item active_${theme.palette.mode}` : "ms-navbar__item"}
                sx={{
                  color: "text.primary",
                }}
              >
                <Box
                  className="ms-navbar__item--icon"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <HomeIcon />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                    fontWeight: "bold",
                  }}
                >
                  Home
                </Box>
              </Button>
            </Link>
            <Link href="/source-code">
              <Button
                className={
                  router.pathname === "/source-code"
                    ? `ms-navbar__item active_${theme.palette.mode}`
                    : "ms-navbar__item"
                }
                sx={{
                  color: "text.primary",
                }}
              >
                <Box
                  className="ms-navbar__item--icon"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <AttachmentIcon />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                    fontWeight: "bold",
                  }}
                >
                  Sources
                </Box>
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                className={
                  router.pathname === "/blog" ? `ms-navbar__item active_${theme.palette.mode}` : "ms-navbar__item"
                }
                sx={{
                  color: "text.primary",
                }}
              >
                <Box
                  className="ms-navbar__item--icon"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <FaBlog />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                    fontWeight: "bold",
                  }}
                >
                  Blog
                </Box>
              </Button>
            </Link>
            {session && session.user.role === "admin" && (
              <Link href="/admin">
                <Button
                  className={
                    router.pathname === "/admin" ? `ms-navbar__item active_${theme.palette.mode}` : "ms-navbar__item"
                  }
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <Box
                    className="ms-navbar__item--icon"
                    sx={{
                      color: "text.primary",
                    }}
                  >
                    <AdminPanelSettingsIcon />
                  </Box>
                  <Box
                    className="ms-navbar__item--title"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    Admin
                  </Box>
                </Button>
              </Link>
            )}
          </Typography>
        </Typography>
      </BoxMenuNavBar>
    </>
  );
};
export default Navbar;
