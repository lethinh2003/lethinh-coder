import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import convertTime from "../../utils/convertTime";
import { memo } from "react";

const DescBlog = (props) => {
  const { blogData } = props;

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
        <h1 className="title">Desciption blog</h1>
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
            {blogData.updatedAt && (
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                <AiOutlineCalendar /> Cập nhật: {convertTime(blogData.updatedAt)}{" "}
              </Typography>
            )}
            <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
              <div className="content-html" dangerouslySetInnerHTML={{ __html: blogData.content }} />
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
export default memo(DescBlog);
