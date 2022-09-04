import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { getDarkMode } from "../redux/actions/getDarkMode";
import BackToTop from "./homePage/BackToTop";
import Footer from "./homePage/Footer";
import Navbar from "./homePage/Navbar";
import Sidebar from "./homePage/Sidebar";
import SidebarMobile from "./homePage/SidebarMobile";

const Layout = (props) => {
  const { data: session, status } = useSession();

  if (session && session.user.access_token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${session.user.access_token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  const [isSidebarMobile, setIsSidebarMobile] = useState(false);

  const getStatusDarkmode = useSelector((state) => state.darkMode.on);
  const dispatch = useDispatch();
  const handleClickSwitch = () => {
    localStorage.setItem("darkMode", !getStatusDarkmode);
    dispatch(getDarkMode(!getStatusDarkmode));
  };
  const handleClickSidebarMobile = (value) => {
    setIsSidebarMobile(!isSidebarMobile);
  };

  return (
    <>
      <Sidebar
        status={status}
        handleClickSidebarMobile={handleClickSidebarMobile}
        handleClickSwitch={handleClickSwitch}
      />
      <Navbar />

      <SidebarMobile
        session={session}
        status={status}
        handleClickSidebarMobile={handleClickSidebarMobile}
        isSidebarMobile={isSidebarMobile}
        setIsSidebarMobile={setIsSidebarMobile}
      />

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
    </>
  );
};
export default Layout;
