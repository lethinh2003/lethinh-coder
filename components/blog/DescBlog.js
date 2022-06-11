import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import convertTime from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import Reaction from "../ReactionPost/Reaction";
import ShareButton from "../ShareSocial/ShareButton";
import Link from "next/link";
const DescBlog = (props) => {
  const { blogData } = props;
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
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
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
        <TitleContent className="title">Desciption blog</TitleContent>
        {blogData && (
          <Box
            sx={{
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
            <h1 style={{ fontFamily: "Noto Sans", fontSize: "3.5rem" }}>{blogData.title}</h1>
            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              📆 Thời gian: {convertTime(blogData.createdAt)}
            </Typography>
            {blogData.updatedAt && (
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                📆 Cập nhật: {convertTime(blogData.updatedAt)}{" "}
              </Typography>
            )}
            <Typography
              sx={{
                fontWeight: "500",
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
            <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
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
