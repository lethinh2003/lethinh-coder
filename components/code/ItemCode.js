import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { NumericFormat } from "react-number-format";
import blurImage from "../../public/blur_image.png";
import { convertTimeAgo } from "../../utils/convertTime";
const CardCode = styled(Card)(({ theme }) => ({
  padding: "15px",
  borderRadius: "20px",

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
  fontSize: "2rem",
  fontWeight: "bold",
  textTransform: "capitalize",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
});
const CardContentCodeDesc = styled(Typography)({
  fontSize: "1.5rem",
});

const TagButton = styled(Box)({
  boxShadow: "none",
  fontSize: "1.3rem",
  borderRadius: "20px",
  textTransform: "lowercase",
  color: "#4b5563",
  fontWeight: "bold",
  backgroundColor: "#e5e6e9",
  padding: "5px 10px",
  cursor: "pointer",
});

const ItemCode = ({ images, title, createdAt, costs, slug, desc, labels }) => {
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
            src={images?.[0]}
            layout="fill"
            objectFit="cover"
            alt={title}
            placeholder="blur"
            blurDataURL={blurImage}
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
              color: "text.secondary",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
              }}
            >
              📆 {convertTimeAgo(createdAt)}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.3rem",
              }}
            >
              💰{" "}
              {costs > 0 && (
                <NumericFormat
                  value={costs}
                  displayType={"text"}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  suffix={" VNĐ"}
                />
              )}
              {costs === 0 && "Free"}
            </Typography>
          </Box>
          <Link href={`/source-code/${slug}`}>
            <CardContentCodeTitle component="div" className="code-title">
              {title}
            </CardContentCodeTitle>
          </Link>

          <CardContentCodeDesc
            sx={{
              color: "text.secondary",
            }}
          >
            {desc}
          </CardContentCodeDesc>
        </CardContentCode>

        <Box
          sx={{
            display: "inline-flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {labels.map((label, i) => (
            <Link key={i} href={`/source-code/label/${encodeURIComponent(label)}`}>
              <TagButton
                sx={{
                  textTransform: "lowercase",
                }}
                variant="outlined"
              >
                #{label.toLowerCase()}
              </TagButton>
            </Link>
          ))}
        </Box>
      </CardCode>
    </>
  );
};
export default memo(ItemCode);
