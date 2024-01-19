import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import blurImage from "../../public/blur_image.png";
import { convertTimeAgo } from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import Reaction from "../ReactionPost/Reaction";
import SocialSharingButton from "./SocialSharingButton";
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
const DescBlog = ({ blogData }) => {
  useEffect(() => {
    const getImage = document.querySelectorAll(".image_resized");
    if (getImage.length > 0) {
      getImage.forEach((item, i) => {
        item.style.width = null;
      });
    }
  }, [blogData]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "center",
          color: "text.primary",
          gap: "10px",

          width: { xs: "100%", lg: "calc(100% - 260px)" },
        }}
      >
        {blogData && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              bgcolor: "background.default",
              justifyContent: "center",
              color: "text.primary",
              gap: "10px",
              padding: { xs: "10px", md: "20px" },
            }}
          >
            <Typography
              component={"h1"}
              sx={{ fontFamily: "Noto Sans", fontSize: { xs: "3.5rem" }, fontWeight: "bold" }}
            >
              {blogData.title}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              📆 Thời gian: {convertTimeAgo(blogData.createdAt)}
            </Typography>
            {blogData.updatedAt && (
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                📆 Cập nhật: {convertTimeAgo(blogData.updatedAt)}
              </Typography>
            )}
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              🕐 {getReadingTime(blogData.content)} phút đọc
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              {blogData.labels.map((item, i) => (
                <Link key={i} href={`/blog/label/${encodeURIComponent(item)}`}>
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
                  height: { xs: "300px" },

                  width: "100%",
                  maxWidth: "600px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={blogData?.images?.[0] || blurImage}
                  layout="fill"
                  objectFit="contain"
                  alt={blogData.title}
                  placeholder="blur"
                  blurDataURL={blurImage}
                />
              </Box>
            </Box>
            <Typography component="div" sx={{ fontFamily: "Noto Sans", width: "100%" }}>
              <div className="content-html" dangerouslySetInnerHTML={{ __html: blogData.content }} />
            </Typography>
            <Reaction blogData={blogData} />

            <SocialSharingButton slug={blogData.slug} />
          </Box>
        )}
      </Box>
    </>
  );
};
export default DescBlog;
