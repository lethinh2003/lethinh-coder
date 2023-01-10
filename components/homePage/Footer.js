import { BottomNavigation, BottomNavigationAction, Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import { AiFillHome } from "react-icons/ai";
import { BsFillFileCodeFill } from "react-icons/bs";
import { FaBlog } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const dataSystem = useSelector((state) => state.system.data);

  const handleChange = (event, newValue) => {
    if (newValue === "home") {
      router.push("/");
    } else if (newValue === "code") {
      router.push("/source-code");
    } else if (newValue === "blog") {
      router.push("/blog");
    }
    setValue(newValue);
  };
  useEffect(() => {
    if (router.pathname === "/") {
      setValue("home");
    } else if (router.pathname.startsWith("/source-code")) {
      setValue("code");
    } else if (router.pathname.startsWith("/blog")) {
      setValue("blog");
    }
  }, [router.pathname]);
  const SocialButton = styled(Button)({
    minWidth: "50px",
    height: "50px",
    backgroundColor: "#222326",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    color: "#fff",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#222326",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const BottomNavigationComponent = styled(BottomNavigation)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: theme.palette.header.background.default,
    height: "70px",
    zIndex: 1002,
    gap: "10px",
    borderTop: theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e",
  }));
  const BottomNavigationActionComponent = styled(BottomNavigationAction)(({ theme }) => ({
    fontSize: "4rem",

    "&.Mui-selected": {
      color: theme.palette.mode === "light" ? "#0e1217" : "#ffffff",

      backgroundColor: theme.palette.mode === "dark" ? "#20262d" : "#eaebec",
      borderRadius: "20px",
      position: "relative",

      "&::before": {
        position: "absolute",
        content: `""`,
        top: 0,
        backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#20262d",
        width: "50%",
        height: "2px",
      },
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#20262d" : "#eaebec",
      borderRadius: "20px",
    },
  }));
  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="myAwesomeCookieName2"
        style={{ background: "#2B373B", fontSize: "1.5rem", zIndex: 9999 }}
        buttonStyle={{ color: "#4e503b", fontSize: "1.5rem", borderRadius: "5px", fontWeight: "bold", padding: "15px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{" "}
      </CookieConsent>
      <BottomNavigationComponent
        sx={{
          display: { xs: "flex", md: "none" },
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationActionComponent value="home" icon={<AiFillHome />} />

        <BottomNavigationActionComponent value="code" icon={<BsFillFileCodeFill />} />

        <BottomNavigationActionComponent value="blog" icon={<FaBlog />} />
      </BottomNavigationComponent>

      <Box
        className="footer"
        sx={{
          padding: { xs: "20px 10px 100px 10px", md: "20px 20px 20px 20px" },
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Typography>LeThinh's Blog © {new Date().getFullYear()}</Typography>
      </Box>
    </>
  );
};
export default Footer;
