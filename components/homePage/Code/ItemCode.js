import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import convertTime from "../../../utils/convertTime";
import getReadingTime from "../../../utils/getReadingTime";
import NumberFormat from "react-number-format";

const ItemCode = ({ item }) => {
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
      <CardCode>
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
    </>
  );
};
export default memo(ItemCode);
