import { Box, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import convertTime from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import { memo } from "react";
const ItemBlog = ({ item }) => {
  const BoxChild2NewBlog = styled(Box)({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  });
  const ChildTitleNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
  });
  const ChildDescNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    color: "#848c9b",
  });

  const Child2ImageNewBlog = styled(CardMedia)({
    minWidth: "250px",
    height: "150px",
    borderRadius: "10px",
  });

  return (
    <>
      <BoxChild2NewBlog>
        <Child2ImageNewBlog
          sx={{
            minWidth: { xs: "150px", md: "250px" },
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
              }}
            >
              📆 {convertTime(item.createdAt)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
              }}
            >
              🕐 {getReadingTime(item.content)} phút đọc
            </Typography>
          </Box>
          <Link href={`/blog/${item.slug}`}>
            <ChildTitleNewBlog
              sx={{
                fontSize: { xs: "16px", md: "18px" },
              }}
            >
              {item.title}
            </ChildTitleNewBlog>
          </Link>
          <ChildDescNewBlog
            sx={{
              fontSize: { xs: "16px", md: "18px" },
            }}
          >
            {item.desc}
          </ChildDescNewBlog>
        </Box>
      </BoxChild2NewBlog>
    </>
  );
};
export default memo(ItemBlog);
