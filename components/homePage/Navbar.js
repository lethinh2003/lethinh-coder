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
import { useMemo, useState, useEffect } from "react";
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
import axios from "axios";
const Navbar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter();
  const handleClickSupport = () => {
    setIsModal(true);
  };
  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const result = await axios.get("/api/system");

        setData(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSystem();
  }, []);

  return (
    <>
      <Modal title={"Thông tin hỗ trợ"} isModal={isModal} setIsModal={setIsModal}>
        <DialogContentText>
          <IconButton color="primary" aria-label="add to shopping cart">
            <FacebookIcon />
          </IconButton>
          {data.length > 0 && <a href={data[0].myself_fb}>{data[0].myself_fb_name}</a>}
        </DialogContentText>
        <DialogContentText>
          <IconButton color="primary" aria-label="add to shopping cart">
            <SiZalo />
          </IconButton>
          {data.length > 0 && <a href={data[0].myself_zalo}>{data[0].myself_zalo_name}</a>}
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
                    }}
                  >
                    Admin
                  </Box>
                </Button>
              </Link>
            )}
            <Button
              onClick={handleClickSupport}
              className="ms-navbar__item"
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
                <ContactSupportIcon />
              </Box>
              <Box
                className="ms-navbar__item--title"
                sx={{
                  color: "text.primary",
                }}
              >
                Support
              </Box>
            </Button>
          </Typography>
        </Typography>
      </Box>
    </>
  );
};
export default Navbar;
