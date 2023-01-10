import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { memo } from "react";
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
        </Box>
      )}
    </>
  );
};
export default memo(InfoBlog);
