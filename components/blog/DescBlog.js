import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import convertTime from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import Reaction from "../ReactionPost/Reaction";
import ShareButton from "../ShareSocial/ShareButton";

const DescBlog = (props) => {
  const { blogData } = props;

  const CodeButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "lowercase",
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
  const ReactionButton = styled(Box)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "30px",
    minWidth: "70px",

    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "5px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#E5E7EB",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
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
        <Typography className="title">Desciption blog</Typography>
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
            <h1 style={{ fontFamily: "Noto Sans" }}>{blogData.title}</h1>
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
                <CodeButton key={i} variant="outlined">
                  #{item.toLowerCase()}
                </CodeButton>
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
