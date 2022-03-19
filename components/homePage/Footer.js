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
} from "@mui/material";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { styled } from "@mui/material/styles";

const Footer = () => {
  const SocialButton = styled(Button)({
    minWidth: "50px",
    height: "50px",
    backgroundColor: "#222326",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
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
  return (
    <>
      <Box
        className="footer"
        sx={{
          padding: { xs: "20px 10px 100px 10px", md: "20px 20px 100px 20px" },
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: "20px", md: "unset" },
          justifyContent: { md: "center" },
        }}
      >
        <Box
          className="about"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            height: "100%",
            gap: "50px",
            alignItems: "flex-start",
          }}
        >
          <Box
            className="about-column"
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              Hỗ trợ
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Liên hệ
              </Typography>
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Bảo mật
              </Typography>
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Điều khoản
              </Typography>
            </Box>
          </Box>
          <Box
            className="about-column"
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              ABOUT ME
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Giới thiệu
              </Typography>
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Đối tác
              </Typography>
            </Box>
          </Box>
          <Box
            className="about-column"
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              CONTACT
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                lethinh.developer@gmail.com
              </Typography>
              <Typography sx={{ fontFamily: "IBM Plex Sans" }} component="span">
                Thinh Le
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          className="social"
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            alignItems: "flex-start",
            flex: "1 1",
            gap: "10px",
          }}
        >
          <SocialButton>
            <FaFacebookF />
          </SocialButton>
          <SocialButton>
            <BsInstagram />
          </SocialButton>
          <SocialButton>
            <BsTwitter />
          </SocialButton>
        </Box>
      </Box>
    </>
  );
};
export default Footer;
