import { Box } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/actions/darkMode";
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

  const isDarkMode = useSelector((state) => state.darkMode.on);
  const dispatch = useDispatch();
  const handleClickSwitch = () => {
    dispatch(setDarkMode(!isDarkMode));
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
