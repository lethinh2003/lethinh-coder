import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { memo, useState } from "react";
import ItemCode from "./Code/ItemCode";
const ShowCodes = (props) => {
  const source = props.sourceCode;
  const [sourceCode, setSourceCode] = useState(typeof source === "string" ? JSON.parse(source) : source);

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
                return <ItemCode key={i} item={item} />;
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
              return <ItemCode key={i} item={item} />;
            })}
        </Box>
      </Box>
    </>
  );
};
export default memo(ShowCodes);
