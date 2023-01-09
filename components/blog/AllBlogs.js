import { Box, Button, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";
import ItemBlog from "./ItemBlog";

const AllBlogs = (props) => {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const AllBlog = useRef();
  const callDataApi = async ({ pageParam = 1 }) => {
    const results = await axios.get(
      `${process.env.ENDPOINT_SERVER}/api/v1/blogs?page=${pageParam}&results=${itemsPerPage}`
    );
    return results.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery("get-all-blogs", callDataApi, {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    getNextPageParam: (_lastPage, pages) => {
      if (pages[pages.length - 1].results === itemsPerPage) {
        return pages.length + 1;
      }
      return undefined;
    },
  });
  useEffect(() => {
    if (error && error.response) {
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);

  const ChildBoxLoading = styled(Box)({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  });

  const BlogTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
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
        <BlogTitle component="h1" ref={AllBlog}>
          All Blog
        </BlogTitle>
        <Box
          sx={{
            padding: { xs: "0px 0px", md: "20px 0px" },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0,1fr))",

                sm: "repeat(2, minmax(0,1fr))",
                md: "repeat(3, minmax(0,1fr))",

                lg: "repeat(4, minmax(0,1fr))",
              },
              gap: "20px",
            }}
          >
            {isLoading &&
              Array.from({ length: itemsPerPage }).map((item, i) => (
                <ChildBoxLoading key={i}>
                  <Skeleton
                    sx={{
                      minWidth: { xs: "150px", md: "250px" },
                      height: { xs: "100px", md: "150px" },
                      borderRadius: "10px",
                    }}
                    variant="rectangular"
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <Skeleton height={20} width={100} />
                    <Skeleton height={50} width={200} />
                  </Box>
                </ChildBoxLoading>
              ))}
            {!isLoading &&
              data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((item) => (
                    <ItemBlog key={item._id} item={item} />
                  ))}
                </React.Fragment>
              ))}
            {isFetchingNextPage &&
              Array.from({ length: itemsPerPage }).map((_item, i) => (
                <ChildBoxLoading key={i}>
                  <Skeleton
                    sx={{
                      minWidth: { xs: "150px", md: "250px" },
                      height: { xs: "100px", md: "150px" },
                      borderRadius: "10px",
                    }}
                    variant="rectangular"
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <Skeleton height={20} width={100} />
                    <Skeleton height={50} width={200} />
                  </Box>
                </ChildBoxLoading>
              ))}
          </Box>
        </Box>
      </Box>
      {hasNextPage && !isFetchingNextPage && (
        <Button variant="contained" onClick={() => fetchNextPage()}>
          Load more
        </Button>
      )}

      {!hasNextPage && (
        <Box
          as={motion.div}
          initial={{ scale: 1 }}
          animate={{ scale: 1.02 }}
          sx={{
            backgroundColor: "#374151",
            padding: "15px",
            borderRadius: "10px",

            color: "#ffffff",
          }}
        >
          <Typography>Đã hết danh sách 👏🏼</Typography>
        </Box>
      )}
    </>
  );
};
export default AllBlogs;
