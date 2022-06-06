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
import Image from "next/image";
import { memo } from "react";
const ShowCodes = (props) => {
  const source = props.sourceCode;
  const [sourceCode, setSourceCode] = useState(typeof source === "string" ? JSON.parse(source) : source);
  const theme = useTheme();
  const CardCode = styled(Card)(({ theme }) => ({
    padding: "15px",
    borderRadius: "20px",
    minWidth: 300,
    overflow: "unset",
    scrollSnapAlign: "center",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,

    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));
  const CardContentCode = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    maxHeight: "130px",
    height: "100%",
  });
  const CardContentCodeTitle = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",
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
                    <Box
                      className="code-container__image"
                      height="140"
                      sx={{
                        borderRadius: "20px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.images[0]}
                        layout="fill"
                        objectFit="cover"
                        alt={item.title}
                        placeholder="blur"
                        blurDataURL="https://i.imgur.com/HYNKD6V.png"
                      />
                    </Box>
                    <CardContentCode>
                      <Link href={`/source-code/${item.slug}`}>
                        <CardContentCodeTitle component="div" className="code-title">
                          {item.title}
                        </CardContentCodeTitle>
                      </Link>
                      <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                        {item.desc}
                      </Typography>
                    </CardContentCode>
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
            gridTemplateColumns: {
              sm: "repeat(2, minmax(0,1fr))",
              md: "repeat(2, minmax(0,1fr))",
              lg: "repeat(3, minmax(0,1fr))",
            },
          }}
        >
          {sourceCode.length > 0 &&
            sourceCode.map((item, i) => {
              return (
                <CardCode key={i}>
                  <Box
                    className="code-container__image"
                    height="140"
                    sx={{
                      borderRadius: "20px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={item.images[0]}
                      layout="fill"
                      objectFit="cover"
                      alt={item.title}
                      placeholder="blur"
                      blurDataURL="https://i.imgur.com/HYNKD6V.png"
                    />
                  </Box>
                  <CardContentCode>
                    <Link href={`/source-code/${item.slug}`}>
                      <CardContentCodeTitle component="div" className="code-title">
                        {item.title}
                      </CardContentCodeTitle>
                    </Link>

                    <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                      {item.desc}
                    </Typography>
                  </CardContentCode>
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
                </CardCode>
              );
            })}
        </Box>
      </Box>
    </>
  );
};
export default memo(ShowCodes);
