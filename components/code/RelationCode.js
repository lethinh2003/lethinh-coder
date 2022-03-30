import { Button, Box, Typography, Card, CardActions, CardContent, CardMedia } from "@mui/material";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { styled } from "@mui/material/styles";

import NumberFormat from "react-number-format";

const RelationCode = (props) => {
  const { sourceCodeRelationship } = props;
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
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
        id="relation"
      >
        Code liên quan
      </Typography>
      <Box
        className="box-code_mobile"
        sx={{
          padding: { xs: "0 10px", md: "0 20px" },
          display: { xs: "block", md: "none" },
        }}
      >
        <div className="box-code_mobile__wrapper">
          {sourceCodeRelationship.length > 0 &&
            sourceCodeRelationship.map((item, i) => {
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
          gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
        }}
      >
        {sourceCodeRelationship.length > 0 &&
          sourceCodeRelationship.map((item, i) => {
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
    </>
  );
};
export default RelationCode;
