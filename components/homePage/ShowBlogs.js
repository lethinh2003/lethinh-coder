import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useState } from "react";

import ItemBlog from "../blog/ItemBlog";
const ShowBlogs = (props) => {
  const [blogData, setBlogData] = useState(JSON.parse(props.blogData));

  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  const CodeTitleSecond = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "1.8rem",
    fontWeight: "bold",
    opacity: 0.8,
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
    },

    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const BoxCodeTitle = styled(Box)({
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",

          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
          padding: "40px 0",
        }}
      >
        <BoxCodeTitle>
          <CodeTitle
            component="h1"
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
            }}
          >
            {props.title}
          </CodeTitle>
          <Link href="/blog">
            <CodeTitleSecond
              sx={{
                padding: { xs: "0 10px", md: "0 20px" },
              }}
            >
              See all
            </CodeTitleSecond>
          </Link>
        </BoxCodeTitle>
        <Box
          sx={{
            padding: { xs: "10px", md: "40px 20px" },
            width: "100%",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                sm: "repeat(2, minmax(0,1fr))",
                md: "repeat(2, minmax(0,1fr))",
                lg: "repeat(3, minmax(0,1fr))",
              },
              gap: "10px",
            }}
          >
            {blogData.length > 0 &&
              blogData.map((item, i) => {
                return <ItemBlog key={i} item={item} />;
              })}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default ShowBlogs;
