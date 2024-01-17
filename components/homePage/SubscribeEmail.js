import InputUnstyled from "@mui/base/InputUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import { Alert, Box, Button, Card, CardContent, Fade, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledInputElement = styled("input")(
  ({ theme }) => `
 
  width: 100%;
  font-size: 1.5rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
  border-radius: 8px;
  padding: 12px 12px;

  &:hover {
    background: ${theme.palette.mode === "dark" ? "" : grey[100]};
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
  }
`
);

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <InputUnstyled components={{ Input: StyledInputElement }} {...props} ref={ref} />;
});

const IntroduceTitle = styled(Typography)({
  fontWeight: "bold",

  fontFamily: "Noto Sans",
  color: "#272fec",
});
const IntroduceDesc = styled(Typography)({
  fontSize: "2rem",
  fontFamily: "Noto Sans",
  color: "#0c1842",
});

const AlertExpress = styled(Alert)({
  fontFamily: "Noto Sans",
  top: "7px",
  position: "absolute",
  opacity: 1,
  left: "50%",
  transform: "translateX(-50%)",
  borderRadius: "10px",
});

const Introduce = () => {
  const timeOutAlert = useRef();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const dataSystem = useSelector((state) => state.system.data);

  useEffect(() => {
    return () => {
      clearTimeout(timeOutAlert.current);
    };
  }, []);

  const handleClickSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/email-subscribers`, {
        email,
      });
      setIsLoading(false);
      setIsSuccess(true);
      setEmail("");
      clearTimeout(timeOutAlert.current);
      timeOutAlert.current = setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } catch (err) {
      clearTimeout(timeOutAlert.current);
      setIsLoading(false);
      setIsSuccess(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "700px",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              backgroundImage: "linear-gradient(120deg,#fcce9a,#ff9e8d)",
              minHeight: 300,
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              boxShadow: "2px 3px 8px 0px #fea38e",
              border: "2px solid #fff",
              position: "relative",
            }}
          >
            <Box>
              {isSuccess && (
                <Fade in={isSuccess}>
                  <AlertExpress icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Cảm ơn bạn đã đăng ký nhận tin
                  </AlertExpress>
                </Fade>
              )}
              <CardContent>
                <IntroduceTitle
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3rem" },
                  }}
                  component="div"
                >
                  Hey, wait...
                </IntroduceTitle>
                <IntroduceDesc variant="span">
                  Trước khi rời đi, bạn hãy đăng ký để nhận thông báo bài viết mới nhất về email nhé!
                </IntroduceDesc>
              </CardContent>

              <Box
                sx={{
                  opacity: isLoading ? 0.7 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "2rem",
                  padding: "0 16px",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CustomInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type email..." />
                <Button onClick={handleClickSubmit}>Subscribe</Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                height: "240px",
                width: "240px",
                position: "relative",
              }}
            >
              <Image src="https://i.imgur.com/jziB6hJ.png" layout="fill" alt="Lethinh blog" objectFit="contain" />
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default Introduce;
