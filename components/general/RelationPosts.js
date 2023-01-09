import { Box, Button, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import ItemBlog from "../blog/ItemBlog";
import ItemCode from "../code/ItemCode";
const RelationPosts = ({ data, typePost }) => {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const callDataApi = async ({ fromID, labels }, pageParam) => {
    const results = await axios.get(
      `${process.env.ENDPOINT_SERVER}/api/v1/${
        typePost === "blog" ? "blogs" : "source-codes"
      }/relationship?labels=${labels}&from=${fromID}&page=${pageParam}&results=${itemsPerPage}`
    );
    return results.data;
  };

  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ["get-relationship-posts", data._id],
    ({ pageParam = 1 }) => callDataApi({ labels: data.labels.join(","), fromID: data._id }, pageParam),
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1].results === itemsPerPage) {
          return pages.length + 1;
        }
        return undefined;
      },
    }
  );
  const ChildBoxLoading = styled(Box)({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  });

  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  return (
    <>
      <TitleContent className="title">Relationship {typePost === "blog" ? "Blogs" : "Codes"}</TitleContent>
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0,1fr))",

              sm: "repeat(2, minmax(0,1fr))",

              lg: "repeat(3, minmax(0,1fr))",
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
            typePost === "blog" &&
            dataQuery?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((item) => {
                  return <ItemBlog key={item._id} item={item} />;
                })}
              </React.Fragment>
            ))}
          {!isLoading &&
            typePost === "code" &&
            dataQuery?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((item) => {
                  return <ItemCode key={item._id} item={item} />;
                })}
              </React.Fragment>
            ))}
          {isFetchingNextPage &&
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
export default RelationPosts;
