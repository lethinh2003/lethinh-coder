import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import LIMIT_RESULTS from "../../configs/pagination";
import TYPE_DISPLAY_LIST from "../../configs/typeDisplayList";
import useGetListBlogs from "../../hooks/useGetListBlogs";
import DisplayListItem from "../general/DisplayListItem";

const BlogTitle = styled(Typography)({
  fontFamily: "Noto sans",
  fontSize: "2.5rem",
  fontWeight: "bold",
});

const BlogsOfLabel = ({ label }) => {
  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetListBlogs({
    labelQuery: label,
    results: LIMIT_RESULTS,
  });
  return (
    <>
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
        <BlogTitle component="h1">{`All Blog: ${label}`}</BlogTitle>
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
export default BlogsOfLabel;
