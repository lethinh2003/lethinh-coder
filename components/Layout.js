import { Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/actions/darkMode";
import BackToTop from "./homePage/BackToTop";
import Footer from "./homePage/Footer";
import Navbar from "./homePage/Navbar";
import Sidebar from "./homePage/Sidebar";
import SidebarMobile from "./homePage/SidebarMobile";

const Layout = (props) => {
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
      <Sidebar handleClickSidebarMobile={handleClickSidebarMobile} handleClickSwitch={handleClickSwitch} />
      <Navbar />

      <SidebarMobile
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
