import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, CardMedia, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import convertTime from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import Image from "next/image";
const Items = ({ currentItems, isLoading, AllBlog }) => {
  const BoxChild2NewBlog = styled(Box)({
    display: "flex",
    gap: "10px",
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
          gap: "10px",
          padding: { xs: "20px 10px", md: "20px 20px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BlogTitle component="h1" ref={AllBlog}>
          All Blog
        </BlogTitle>
        {isLoading &&
          Array.from({ length: 20 }).map((item, i) => (
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
          currentItems &&
          currentItems.length > 0 &&
          currentItems.map((item, i) => {
            return (
              <BoxChild2NewBlog key={i}>
                <Child2ImageNewBlog
                  sx={{
                    minWidth: { xs: "150px", md: "250px" },
                    height: { xs: "100px", md: "150px" },
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.images[0]}
                    layout="fill"
                    objectFit="cover"
                    alt={item.title}
                    placeholder="blur"
                    blurDataURL="https://i.imgur.com/HYNKD6V.png"
                  />
                </Child2ImageNewBlog>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                    }}
                  >
                    📆 {convertTime(item.createdAt)}
                  </Typography>
                  <Link href={`blog/${item.slug}`}>
                    <ChildTitleNewBlog
                      sx={{
                        fontSize: { xs: "16px", md: "18px" },
                      }}
                    >
                      {item.title}
                    </ChildTitleNewBlog>
                  </Link>
                  <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                      }}
                    >
                      🕐 {getReadingTime(item.content)} phút đọc/{item.views} views
                    </Typography>
                  </Typography>
                </Box>
              </BoxChild2NewBlog>
            );
          })}
      </Box>
    </>
  );
};
const AllBlogs = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const AllBlog = useRef();
  useEffect(() => {
    const getBlog = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get("/api/blog");
        setBlogData(results.data.data);
        setSourceCodeAll(results.data.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    getBlog();
  }, []);
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(blogData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(blogData.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, blogData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogData.length;
    setItemOffset(newOffset);
    window.scrollTo(0, AllBlog.current.offsetTop - AllBlog.current.offsetHeight * 2);
  };

  return (
    <>
      <Items currentItems={currentItems} isLoading={isLoading} AllBlog={AllBlog} />
      <Box>
        <ReactPaginate
          containerClassName="pagination"
          pageLinkClassName="button"
          activeLinkClassName="active"
          previousLinkClassName="button"
          nextLinkClassName="button"
          breakLabel="..."
          nextLabel={<NavigateNextIcon />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={<NavigateBeforeIcon />}
          renderOnZeroPageCount={null}
        />
      </Box>
    </>
  );
};
export default AllBlogs;
