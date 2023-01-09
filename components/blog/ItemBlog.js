import { Box, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import ReactTimeago from "react-timeago";
import getReadingTime from "../../utils/getReadingTime";

const ItemBlog = ({ item }) => {
  const BoxChild2NewBlog = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "10px",
    padding: "15px",
    borderRadius: "20px",
    flexDirection: "column",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,
    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));
  const ChildTitleNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
  });
  const ChildDescNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "1.5rem",
  });

  const Child2ImageNewBlog = styled(CardMedia)({
    minWidth: "250px",
    height: "150px",
    borderRadius: "10px",
  });
  const TagButton = styled(Box)({
    boxShadow: "none",
    fontSize: "1.3rem",
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
      <BoxChild2NewBlog
        as={motion.div}
        whileHover={{
          scale: 1.02,
        }}
      >
        <Child2ImageNewBlog
          sx={{
            minWidth: { xs: "150px", md: "150px" },
            height: "200px",
            // height: { xs: "100px", md: "150px" },
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
        </Child2ImageNewBlog>
        <Box sx={{ display: "flex", flexDirection: "column", padding: "20px 0px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              color: "text.secondary",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
              }}
            >
              📆 <ReactTimeago date={item.createdAt} />
            </Typography>
            <Typography
              sx={{
                fontSize: "1.3rem",
              }}
            >
              🕐 {getReadingTime(item.content)} phút đọc
            </Typography>
          </Box>
          <Link href={`/blog/${item.slug}`}>
            <ChildTitleNewBlog>{item.title}</ChildTitleNewBlog>
          </Link>
          <ChildDescNewBlog
            sx={{
              color: "text.secondary",
            }}
          >
            {item.desc}
          </ChildDescNewBlog>
        </Box>
        <Box
          sx={{
            display: "inline-flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {item.labels.map((item, i) => (
            <Link key={i} href={`/blog/label/${item}`}>
              <TagButton
                sx={{
                  textTransform: "lowercase",
                }}
                variant="outlined"
              >
                #{item.toLowerCase()}
              </TagButton>
            </Link>
          ))}
        </Box>
      </BoxChild2NewBlog>
    </>
  );
};
export default memo(ItemBlog);
