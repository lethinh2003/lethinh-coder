import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import convertTime from "../../utils/convertTime";

const DescBlog = (props) => {
  const { blogData, status } = props;

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
        {blogData.length > 0 &&
          blogData.map((item, i) => {
            return (
              <Box
                key={i}
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
                <h1 style={{ fontFamily: "Noto Sans" }}>{item.title}</h1>
                {item.updatedAt && (
                  <Typography
                    sx={{
                      fontWeight: "500",
                    }}
                  >
                    <AiOutlineCalendar /> Cập nhật: {convertTime(blogData[0].updatedAt)}{" "}
                  </Typography>
                )}
                <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
                  <div className="content-html" dangerouslySetInnerHTML={{ __html: item.content }} />
                </Typography>
              </Box>
            );
          })}
      </Box>
    </>
  );
};
export default DescBlog;
