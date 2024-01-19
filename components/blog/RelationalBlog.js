import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import TYPE_DISPLAY_LIST from "../../configs/typeDisplayList";
import useGetListRelationalBlogs from "../../hooks/useGetListRelationalBlogs";
import DisplayListItem from "../general/DisplayListItem";

const TitleContent = styled(Typography)({
  fontFamily: "Bebas Neue",
  position: "relative",
  fontSize: "2.5rem",
  fontWeight: "bold",
});
const LIMIT_RESULTS = 3;
const RelationalBlog = ({ labels, blogId }) => {
  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetListRelationalBlogs({
    fromBlogId: blogId,
    labelQuery: labels.join(","),
    results: LIMIT_RESULTS,
  });

  return (
    <>
      <TitleContent className="title">Relationship Blogs</TitleContent>
      <Box
        sx={{
          width: "100%",
          flexWrap: "wrap",
          bgcolor: "background.default",
          justifyContent: "space-between",
          color: "text.primary",
          gap: "20px",
          padding: { xs: "20px 10px", md: "20px 20px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DisplayListItem
          type={TYPE_DISPLAY_LIST.BLOG}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          dataQuery={dataQuery}
          fetchNextPage={fetchNextPage}
        />
      </Box>
    </>
  );
};
export default RelationalBlog;
