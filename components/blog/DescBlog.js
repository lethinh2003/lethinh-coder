import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { memo, useEffect } from "react";
import TimeAgo from "react-timeago";
import getReadingTime from "../../utils/getReadingTime";
import Reaction from "../ReactionPost/Reaction";
import ShareButton from "../ShareSocial/ShareButton";

const DescBlog = (props) => {
  const { blogData } = props;
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
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
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
          padding: "40px 0",
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
              sx={{ fontFamily: "Noto Sans", fontSize: { xs: "2rem", lg: "3.5rem" }, fontWeight: "bold" }}
            >
              {blogData.title}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              📆 Thời gian: <TimeAgo date={blogData.createdAt} />
            </Typography>
            {blogData.updatedAt && (
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                📆 Cập nhật: <TimeAgo date={blogData.updatedAt} />
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
            <Typography component="div" sx={{ fontFamily: "Noto Sans", width: "100%" }}>
              <div className="content-html" dangerouslySetInnerHTML={{ __html: blogData.content }} />
            </Typography>
            <Reaction blogData={blogData} />

            <ShareButton blogData={blogData} />
          </Box>
        )}
      </Box>
    </>
  );
};
export default memo(DescBlog);
