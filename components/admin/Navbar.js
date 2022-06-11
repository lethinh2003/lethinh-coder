import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillHome, AiFillTool } from "react-icons/ai";
import { HiTemplate } from "react-icons/hi";

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
  const MenuNavBarItem = styled(Box)(({ theme }) => ({
    flexDirection: "column",
    width: "80px",
    height: "80px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    opacity: 0.85,
    backgroundColor: theme.palette.navItem.background,

    "&:hover": {
      backgroundColor: theme.palette.navItem.hover,
      borderRadius: "20px",
    },

    "&.active": {
      backgroundColor: theme.palette.navItem.active,
      borderRadius: "20px",
    },
  }));

  const listItem = [
    {
      key: "/",
      value: "Home",
      icon: <AiFillHome />,
    },
    {
      key: "/admin",
      value: "Admin",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      key: "/admin/source-code",
      value: "Source",
      icon: <DriveFileMoveIcon />,
    },
    {
      key: "/admin/blog",
      value: "Blog",
      icon: <HiTemplate />,
    },
    {
      key: "/admin/tools",
      value: "Tools",
      icon: <AiFillTool />,
    },
  ];
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
            {listItem.map((item, i) => (
              <Link href={item.key} key={i}>
                <MenuNavBarItem
                  className={
                    i > 1 && router.pathname.startsWith(item.key)
                      ? `active`
                      : i === 1 && router.pathname === item.key
                      ? `active`
                      : null
                  }
                >
                  <Box
                    className="ms-navbar__item--icon"
                    sx={{
                      color: "text.primary",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box
                    className="ms-navbar__item--title"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    {item.value}
                  </Box>
                </MenuNavBarItem>
              </Link>
            ))}
          </Typography>
        </Typography>
      </BoxMenuNavBar>
    </>
  );
};
export default Navbar;
