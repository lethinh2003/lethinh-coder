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
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import NumberFormat from "react-number-format";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { useTheme } from "@mui/material/styles";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { styled } from "@mui/material/styles";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
const Introduce = (props) => {
  const IntroduceButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const IntroduceTitle = styled(Typography)({
    fontWeight: "bold",

    fontFamily: "Noto Sans",
    color: "#272fec",
  });
  const IntroduceDesc = styled(Typography)({
    fontSize: "20px",
    fontFamily: "Noto Sans",
    color: "#0c1842",
  });
  const IconExpress1 = styled(ThumbUpOffAltIcon)({
    color: "#745544",
    "&:hover": {
      color: "#0043ff",
      transform: "scale(1.3)",
    },
  });
  const IconExpress2 = styled(InsertEmoticonIcon)({
    color: "#745544",
    "&:hover": {
      color: "#fbff00",
      transform: "scale(1.3)",
    },
  });
  const IconExpress3 = styled(SentimentSatisfiedIcon)({
    color: "#745544",
    "&:hover": {
      color: "#c000ff",
      transform: "scale(1.3)",
    },
  });
  const IconExpress4 = styled(SentimentVeryDissatisfiedIcon)({
    color: "#745544",
    "&:hover": {
      color: "#f70d0d",
      transform: "scale(1.3)",
    },
  });

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
            }}
          >
            <Box>
              <CardContent>
                <IntroduceTitle
                  sx={{
                    fontSize: { xs: "25px", md: "30px" },
                  }}
                  component="div"
                >
                  Hey, wait...
                </IntroduceTitle>
                <IntroduceDesc variant="span">
                  Trước khi rời đi, xin một đóng góp ý kiến của bạn về website này nhé!!
                </IntroduceDesc>
              </CardContent>
              <CardActions
                sx={{
                  padding: "0 16px",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <IconButton>
                  <IconExpress1 />
                </IconButton>
                <IconButton>
                  <IconExpress2 />
                </IconButton>
                <IconButton>
                  <IconExpress3 />
                </IconButton>
                <IconButton>
                  <IconExpress4 />
                </IconButton>
              </CardActions>
            </Box>
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                flex: 1,
                display: { xs: "none", md: "block" },
              }}
              height="240"
              image="https://i.imgur.com/jziB6hJ.png"
              alt="Lethinh blog"
            />
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default Introduce;
