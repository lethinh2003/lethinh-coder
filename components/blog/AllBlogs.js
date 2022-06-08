import { Box, Button, CardMedia, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ItemBlog from "./ItemBlog";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
const AllBlogs = (props) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [blogData, setBlogData] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const AllBlog = useRef();
  const callDataApi = async () => {
    const results = await axios.get(
      `${process.env.ENDPOINT_SERVER}/api/v1/blogs?page=${pageCount}&results=${itemsPerPage}`
    );
    return results.data;
  };
  const getListQuery = useQuery("get-all-blogs", callDataApi, {
    cacheTime: Infinity, //Thời gian cache data, ví dụ: 5000, sau 5s thì cache sẽ bị xóa, khi đó data trong cache sẽ là undefined
    refetchOnWindowFocus: false,
  });
  const { data, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
  useEffect(() => {
    if (error && error.response) {
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);
  useEffect(() => {
    if (data) {
      if (data.results === itemsPerPage) {
        setIsLoadMore(true);
        setPageCount((prev) => prev + 1);
      } else {
        setIsLoadMore(false);
      }
      setBlogData(data.data);
    }
  }, [data]);

  const handleClickLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      setIsLoadMore(false);
      const results = await axios.get(
        `${process.env.ENDPOINT_SERVER}/api/v1/blogs?page=${pageCount}&results=${itemsPerPage}`
      );
      if (results.data.results === itemsPerPage) {
        setIsLoadMore(true);
        setPageCount((prev) => prev + 1);
      } else {
        setIsLoadMore(false);
      }
      setIsLoadingMore(false);

      setBlogData((prev) => [...prev, ...results.data.data]);
    } catch (err) {
      setIsLoadingMore(false);
      console.log(err);
      setIsLoadMore(false);
    }
  };
  const BoxChild2NewBlog = styled(Box)({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  });
  const ChildTitleNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
  });
  const ChildImageNewBlog = styled(CardMedia)({
    width: "100%",
    height: "100%",
  });
  const Child2ImageNewBlog = styled(CardMedia)({
    minWidth: "250px",
    height: "150px",
    borderRadius: "10px",
  });
  const BlogTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
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
            padding: { xs: "0px 0px", md: "20px 100px" },
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
                <BoxChild2NewBlog key={i}>
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
                </BoxChild2NewBlog>
              ))}
            {!isLoading &&
              blogData &&
              blogData.length > 0 &&
              blogData.map((item, i) => {
                return <ItemBlog key={i} item={item} />;
              })}
            {isLoadingMore &&
              Array.from({ length: itemsPerPage }).map((item, i) => (
                <BoxChild2NewBlog key={i}>
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
                </BoxChild2NewBlog>
              ))}
          </Box>
          {/* {isLoading &&
          Array.from({ length: 5 }).map((item, i) => (
            <BoxChild2NewBlog key={i}>
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
            </BoxChild2NewBlog>
          ))}
        {!isLoading &&
          blogData &&
          blogData.length > 0 &&
          blogData.map((item, i) => {
            return <ItemBlog key={i} item={item} />;
          })} */}
        </Box>
      </Box>
      {isLoadMore && (
        <Button variant="contained" onClick={() => handleClickLoadMore()}>
          Load more
        </Button>
      )}
    </>
  );
};
export default AllBlogs;
