import { Box } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/actions/darkMode";
import BackToTop from "../homePage/BackToTop";
import Footer from "../homePage/Footer";
import Sidebar from "../homePage/Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";

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
    dispatch(setDarkMode(!getStatusDarkmode));
  };
  const handleClickSidebarMobile = () => {
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
    </>
  );
};
export default Layout;
