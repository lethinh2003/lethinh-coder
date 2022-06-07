import { Box, Button, CardMedia, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
const InfoBlog = (props) => {
  const { blogData } = props;
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
                width={1920}
                height={1920}
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
