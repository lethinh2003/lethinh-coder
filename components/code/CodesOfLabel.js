import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import LIMIT_RESULTS from "../../configs/pagination";
import useGetListCodes from "../../hooks/useGetListCodes";
import DisplayListItem from "../general/DisplayListItem";

const BlogTitle = styled(Typography)({
  fontFamily: "Noto sans",
  fontSize: "2.5rem",
  fontWeight: "bold",
});

const CodesOfLabel = ({ label }) => {
  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetListCodes({
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
        <BlogTitle component="h1">{`All Source Code: ${label}`}</BlogTitle>
        <DisplayListItem
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
export default CodesOfLabel;
