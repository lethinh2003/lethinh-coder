import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TYPE_DISPLAY_LIST from "../../configs/typeDisplayList";
import useGetListBlogs from "../../hooks/useGetListBlogs";
import handleQueryParams from "../../utils/handleQueryParams";
import DisplayListItem from "../general/DisplayListItem";
import FilterBlog from "./FilterBlog";

const BlogTitle = styled(Typography)({
  fontFamily: "Noto sans",
  fontSize: "2.5rem",
  fontWeight: "bold",
});
const AllBlogs = ({ query }) => {
  const router = useRouter();
  const { sort, q } = query;
  const [filterValues, setFilterValues] = useState({
    date: sort?.split(" ")?.[0] || "-createdAt",
  });
  const [sortQuery, setSortQuery] = useState(sort);
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    // Join sort param
    setSortQuery(Object.values(filterValues).join(" "));
  }, [filterValues]);
  useEffect(() => {
    console.log(sortQuery);
    const queryParams = {
      sort: sortQuery,
      q: searchQuery,
    };
    const queryParamsString = handleQueryParams(queryParams);
    router.replace(`?${queryParamsString}`, null, {
      shallow: true,
    });
  }, [sortQuery, searchQuery]);

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
    sortQuery,
    searchQuery,
  });

  useEffect(() => {
    if (error && error.response) {
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);

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
        <BlogTitle component="h1">All Blog</BlogTitle>

        <FilterBlog
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />

        <BlogTitle
          sx={{
            padding: { xs: "0 10px", md: "0 20px" },
          }}
        >
          Kết quả
        </BlogTitle>
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
      </Box>
    </>
  );
};
export default AllBlogs;
