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

const ShowCodes = (props) => {
  const [sourceCode, setSourceCode] = useState(JSON.parse(props.sourceCode));

  const theme = useTheme();
  const CardCode = styled(Card)({
    padding: "15px",
    borderRadius: "20px",
    minWidth: 300,
    overflow: "unset",
    scrollSnapAlign: "center",
  });
  const CardContentCode = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  });
  const CardContentCodeTitle = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
    fontWeight: "bold",
  });
  const CodeTitleSecond = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "18px",
    fontWeight: "bold",
    opacity: 0.8,
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
    },

    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const BoxCodeTitle = styled(Box)({
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  });
  const CodeButton = styled(Button)({
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
          padding: "40px 0",
        }}
      >
        {/* <Typography
          component="h1"
          className="title"
          sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
        >
          {props.title}
        </Typography> */}
        <BoxCodeTitle>
          <CodeTitle
            component="h1"
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
            }}
          >
            {props.title}
          </CodeTitle>
          <Link href="/source-code">
            <CodeTitleSecond
              sx={{
                padding: { xs: "0 10px", md: "0 20px" },
              }}
            >
              See all
            </CodeTitleSecond>
          </Link>
        </BoxCodeTitle>
        <Box
          className="box-code_mobile"
          sx={{
            padding: { xs: "0 10px", md: "0 20px" },
            display: { xs: "block", md: "none" },
          }}
        >
          <div className="box-code_mobile__wrapper">
            {sourceCode.length > 0 &&
              sourceCode.map((item, i) => {
                return (
                  <CardCode key={i}>
                    <CardMedia
                      className="code-container__image"
                      component="img"
                      height="140"
                      image={item.images[0]}
                      alt={item.title}
                      sx={{
                        borderRadius: "20px",
                      }}
                    />
                    <CardContentCode>
                      <Link href={`/source-code/${item.slug}`}>
                        <CardContentCodeTitle component="div" className="code-title">
                          {item.title}
                        </CardContentCodeTitle>
                      </Link>
                      <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                        {item.desc}
                      </Typography>
                      <Typography sx={{ marginTop: "20px", display: "flex" }}>
                        {item.costs > 0 && (
                          <CodeButton variant="outlined">
                            <NumberFormat
                              value={item.costs}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              suffix={" VNĐ"}
                            />{" "}
                          </CodeButton>
                        )}
                        {item.costs === 0 && <CodeButton variant="outlined">Free</CodeButton>}
                      </Typography>
                    </CardContentCode>
                  </CardCode>
                );
              })}
          </div>
        </Box>
        <Box
          sx={{
            width: "100%",
            flexWrap: "wrap",
            bgcolor: "background.default",
            justifyContent: "space-between",
            color: "text.primary",
            gap: "10px",
            padding: "40px 20px",
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
          }}
        >
          {sourceCode.length > 0 &&
            sourceCode.map((item, i) => {
              return (
                <CardCode key={i}>
                  <CardMedia
                    className="code-container__image"
                    component="img"
                    height="140"
                    image={item.images[0]}
                    alt={item.title}
                    sx={{
                      borderRadius: "20px",
                    }}
                  />
                  <CardContentCode>
                    <Link href={`/source-code/${item.slug}`}>
                      <CardContentCodeTitle component="div" className="code-title">
                        {item.title}
                      </CardContentCodeTitle>
                    </Link>

                    <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                      {item.desc}
                    </Typography>
                    <Typography sx={{ marginTop: "20px" }}>
                      {item.costs > 0 && (
                        <CodeButton variant="outlined">
                          <NumberFormat
                            value={item.costs}
                            displayType={"text"}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            suffix={" VNĐ"}
                          />
                        </CodeButton>
                      )}
                      {item.costs === 0 && <CodeButton variant="outlined">Free</CodeButton>}
                    </Typography>
                  </CardContentCode>
                </CardCode>
              );
            })}
        </Box>
      </Box>
    </>
  );
};
export default ShowCodes;
