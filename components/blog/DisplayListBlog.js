import { Box, Button, Skeleton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import LIMIT_RESULTS from "../../configs/pagination";
import ItemCode from "./ItemCode";

const DisplayListBlog = ({ isLoading, dataQuery, isFetchingNextPage, hasNextPage, fetchNextPage }) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          flexWrap: "wrap",
          bgcolor: "background.default",
          alignItems: "center",

          color: "text.primary",
          gap: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            padding: { xs: "0px 0px", md: "20px 0px" },
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0,1fr))",

                sm: "repeat(2, minmax(0,1fr))",
                md: "repeat(3, minmax(0,1fr))",

                xl: "repeat(4, minmax(0,1fr))",
              },
              gap: "20px",
            }}
          >
            {isLoading &&
              Array.from({ length: LIMIT_RESULTS }).map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <Skeleton
                    sx={{
                      height: { xs: "100px", md: "150px" },
                      borderRadius: "10px",
                    }}
                    variant="rectangular"
                  />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <Skeleton height={20} width={100} />
                    <Skeleton height={50} width={200} />
                  </Box>
                </Box>
              ))}
            {!isLoading &&
              dataQuery?.map((item) => {
                return (
                  <ItemCode
                    key={item._id}
                    images={item.images}
                    title={item.title}
                    createdAt={item.createdAt}
                    costs={item.costs}
                    slug={item.slug}
                    desc={item.desc}
                    labels={item.labels}
                  />
                );
              })}
            {isFetchingNextPage &&
              Array.from({ length: LIMIT_RESULTS }).map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
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
                </Box>
              ))}
          </Box>
        </Box>
        {hasNextPage && !isFetchingNextPage && (
          <Button variant="contained" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        )}
        {!hasNextPage && dataQuery && (
          <Box
            as={motion.div}
            initial={{ scale: 1 }}
            animate={{ scale: 1.02 }}
            sx={{
              backgroundColor: "#374151",
              padding: "15px",
              borderRadius: "10px",
              width: "fit-content",
              color: "#ffffff",
            }}
          >
            <Typography>Đã hết danh sách 👏🏼</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
export default DisplayListBlog;
