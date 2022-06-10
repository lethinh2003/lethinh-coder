import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import NumberFormat from "react-number-format";
import convertTime from "../../utils/convertTime";

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
  });
  const CardContentCodeTitle = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  });

  const TagButton = styled(Box)({
    boxShadow: "none",
    fontSize: "1.2rem",
    borderRadius: "20px",
    textTransform: "lowercase",
    fontFamily: "Noto Sans",
    color: "#4b5563",
    fontWeight: "bold",
    backgroundColor: "#e5e6e9",
    padding: "5px 10px",
    cursor: "pointer",
  });

  return (
    <>
      <CardCode
        as={motion.div}
        whileHover={{
          scale: 1.02,
        }}
      >
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.4rem", md: "1.6rem" },
              }}
            >
              📆 {convertTime(item.createdAt)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.4rem", md: "1.6rem" },
                fontWeight: "bold",
              }}
            >
              💰{" "}
              {item.costs > 0 && (
                <NumberFormat
                  value={item.costs}
                  displayType={"text"}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  suffix={" VNĐ"}
                />
              )}
              {item.costs === 0 && "Free"}
            </Typography>
          </Box>
          <Link href={`/source-code/${item.slug}`}>
            <CardContentCodeTitle component="div" className="code-title">
              {item.title}
            </CardContentCodeTitle>
          </Link>

          <Typography sx={{ color: "#848c9b" }}>{item.desc}</Typography>
        </CardContentCode>

        <Box
          sx={{
            display: "inline-flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {item.labels.map((item, i) => (
            <TagButton
              key={i}
              sx={{
                textTransform: "lowercase",
              }}
              variant="outlined"
            >
              #{item.toLowerCase()}
            </TagButton>
          ))}
        </Box>
      </CardCode>
    </>
  );
};
export default memo(ItemCode);
