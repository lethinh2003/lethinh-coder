import { Box, Button, CardMedia, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ItemBlog from "./ItemBlog";
const BlogsOfLabel = ({ label }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [blogData, setBlogData] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(process.env.LIMIT_RESULTS * 1 || 10);
  const AllBlog = useRef();
  const currentPage = useRef(1);
  useEffect(() => {
    currentPage.current = 1;
  }, [label]);
  useEffect(() => {
    if (label) {
      const getBlogsByLabel = async () => {
        try {
          setIsLoading(true);
          const results = await axios.get(
            `${process.env.ENDPOINT_SERVER}/api/v1/blogs/relationship?labels=${label}&page=${currentPage.current}&results=${itemsPerPage}`
          );
          if (results.data.results === itemsPerPage) {
            setIsLoadMore(true);
            currentPage.current = currentPage.current + 1;
          } else {
            setIsLoadMore(false);
          }

          setIsLoading(false);
          setBlogData(results.data.data);
        } catch (err) {
          setIsLoading(false);
          if (err.response) {
            toast.error(err.response.data.message);
          }
          setIsLoadMore(false);
        }
      };
      getBlogsByLabel();
    }
  }, [label]);

  const handleClickLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      setIsLoadMore(false);
      const results = await axios.get(
        `${process.env.ENDPOINT_SERVER}/api/v1/blogs/relationship?labels=${label}&page=${currentPage.current}&results=${itemsPerPage}`
      );
      if (results.data.results === itemsPerPage) {
        setIsLoadMore(true);
        currentPage.current = currentPage.current + 1;
      } else {
        setIsLoadMore(false);
      }
      setIsLoadingMore(false);

      setBlogData((prev) => [...prev, ...results.data.data]);
    } catch (err) {
      setIsLoadingMore(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
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
          All Blog : {label}
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
export default BlogsOfLabel;
