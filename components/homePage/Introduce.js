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

import { styled } from "@mui/material/styles";

const Introduce = (props) => {
  const IntroduceButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#48e8a2",
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
    fontSize: "40px",
    fontFamily: "Noto Sans",
    color: "#fff",
  });
  const IntroduceDesc = styled(Typography)({
    fontSize: "20px",
    fontFamily: "Noto Sans",
    color: "#fff",
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
            flexWrap: "wrap",
            bgcolor: "background.default",
            justifyContent: "space-between",
            color: "text.primary",
            gap: "10px",
            padding: "10px 20px",
            display: "flex",
          }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              backgroundImage: "linear-gradient(120deg,#65f6af,#1cd48f)",
              minHeight: 350,
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            <Box>
              <CardContent>
                <IntroduceTitle component="div">Tải xuống mã nguồn miễn phí</IntroduceTitle>
                <IntroduceDesc variant="span">Hệ thống chia sẻ mã nguồn miễn phí, chất lượng</IntroduceDesc>
              </CardContent>
              <CardActions
                sx={{
                  padding: "0 16px",
                }}
              >
                <Link href="/source-code">
                  <IntroduceButton size="small" variant="contained">
                    Xem ngay
                  </IntroduceButton>
                </Link>
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
              image="https://i.imgur.com/behNN0y.png"
              alt="Lethinh blog"
            />
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default Introduce;
