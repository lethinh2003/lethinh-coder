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
  DialogContentText,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SourceIcon from "@mui/icons-material/Source";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Modal from "./Modal";
import FacebookIcon from "@mui/icons-material/Facebook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useRouter } from "next/router";
import { SiZalo } from "react-icons/si";
import { GrUserAdmin } from "react-icons/gr";
import { useSession } from "next-auth/react";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { AiFillTool } from "react-icons/ai";
import { HiTemplate } from "react-icons/hi";
import { styled } from "@mui/material/styles";

import axios from "axios";
const Navbar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const handleClickSupport = () => {
    setIsModal(true);
  };
  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const result = await axios.get("/api/system");
        console.log(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSystem();
  }, []);
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
                  }}
                >
                  Home
                </Box>
              </Button>
            </Link>

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
                  }}
                >
                  Admin
                </Box>
              </Button>
            </Link>
            <Link href="/admin/source-code">
              <Button
                className={
                  router.pathname === "/admin/source-code"
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
                  <DriveFileMoveIcon />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  Source
                </Box>
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button
                className={
                  router.pathname === "/admin/blog" ? `ms-navbar__item active_${theme.palette.mode}` : "ms-navbar__item"
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
                  <HiTemplate />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  Blog
                </Box>
              </Button>
            </Link>
            <Link href="/admin/tools">
              <Button
                className={
                  router.pathname === "/admin/tools"
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
                  <AiFillTool />
                </Box>
                <Box
                  className="ms-navbar__item--title"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  Tools
                </Box>
              </Button>
            </Link>
          </Typography>
        </Typography>
      </BoxMenuNavBar>
    </>
  );
};
export default Navbar;
