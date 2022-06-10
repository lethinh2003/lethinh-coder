import { Box, Button, CardMedia, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
const InfoBlog = (props) => {
  const { blogData } = props;
  return (
    <>
      {blogData && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            padding: "20px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>
            <Link style={{ color: "inherit" }} href="/blog">
              Blog
            </Link>
            <Typography color="text.primary">{blogData.title}</Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              width: "100%",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                height: "500px",

                width: "100%",
                borderRadius: "10px",
                objectFit: "cover",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={blogData.images[0]}
                layout="fill"
                objectFit="cover"
                alt={blogData.title}
                placeholder="blur"
                blurDataURL="https://i.imgur.com/HYNKD6V.png"
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
export default memo(InfoBlog);
