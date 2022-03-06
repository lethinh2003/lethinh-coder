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
import { useMemo, useState } from "react";
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
const Navbar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const handleClickSupport = () => {
    setIsModal(true);
  };

  return (
    <>
      <Modal title={"Thông tin hỗ trợ"} isModal={isModal} setIsModal={setIsModal}>
        <DialogContentText>
          <IconButton color="primary" aria-label="add to shopping cart">
            <FacebookIcon />
          </IconButton>
          <a href="https://www.facebook.com/thinhvle2210/" target="_blank" rel="noopener noreferrer">
            Van Thinh Le
          </a>
        </DialogContentText>
        <DialogContentText>
          <IconButton color="primary" aria-label="add to shopping cart">
            <SiZalo />
          </IconButton>
          <a href="https://zalo.me/lethinhpro123">Thinh Lee</a>
        </DialogContentText>
      </Modal>
      <Box
        sx={{
          bgcolor: "header.background.default",
          color: "text.primary",
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
          </Typography>
        </Typography>
      </Box>
    </>
  );
};
export default Navbar;
