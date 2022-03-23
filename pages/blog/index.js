import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  TextField,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import ReactPaginate from "react-paginate";
import Layout from "../../components/Layout";
import { styled } from "@mui/material/styles";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
import convertTime from "../../utils/convertTime";
import { GrFormView } from "react-icons/gr";

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
      {/* <ImageGrid image="https://i.imgur.com/wneKXkz.png" />
          <ContentGrid>
            <TitleGrid>Tôi Đã Đến Với Lập Trình Website Như Thế Nào</TitleGrid>
          </ContentGrid> */}

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
                  }}
                  image={item.images[0]}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                    }}
                  >
                    {convertTime(item.createdAt)}
                  </Typography>
                  <ChildTitleNewBlog
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                    }}
                  >
                    {item.title}
                  </ChildTitleNewBlog>
                  <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                      }}
                    >
                      <GrFormView /> {item.readTime} phút đọc/{item.views} views
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
const BlogComponent = (props) => {
  let { newBlog } = props;
  newBlog = JSON.parse(newBlog);

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

  const BlogTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
    fontWeight: "bold",
  });
  const BoxNewBlog = styled(Box)({
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    gap: "10px",
  });
  const BoxChild1NewBlog = styled(Box)({
    display: "flex",
    flexDirection: "column",

    gap: "10px",
  });
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

  return (
    <>
      <Head>
        <title>{`Blog cuộc sống lập trình viên - LT Blog`}</title>
        <meta name="description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:title" content={`Blog cuộc sống lập trình viên - LT Blog`} />
        <meta property="og:description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.imgur.com/1YZrvwt.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
      </Head>
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: "40px 0",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>

            <Typography color="text.primary">Blog</Typography>
          </Breadcrumbs>
          <BlogTitle
            component="h1"
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
              alignSelf: "flex-start",
            }}
          >
            New Blog
          </BlogTitle>

          <BoxNewBlog
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {newBlog && newBlog.length > 0 && (
              <BoxChild1NewBlog
                sx={{
                  width: { xs: "100%", md: "70%" },
                }}
              >
                <CardMedia
                  sx={{
                    width: "100%",
                    height: "310px",
                    borderRadius: "10px",
                  }}
                  image={newBlog[0].images[0]}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                    }}
                  >
                    {convertTime(newBlog[0].createdAt)}
                  </Typography>
                  <ChildTitleNewBlog
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                    }}
                  >
                    {newBlog[0].title}
                  </ChildTitleNewBlog>
                  <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                      }}
                    >
                      <GrFormView /> {newBlog[0].readTime} phút đọc/{newBlog[0].views} views
                    </Typography>
                  </Typography>
                </Box>
              </BoxChild1NewBlog>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {newBlog &&
                newBlog.slice(1).map((item, i) => (
                  <BoxChild2NewBlog key={i}>
                    <Child2ImageNewBlog
                      sx={{
                        minWidth: { xs: "150px", md: "250px" },
                        height: { xs: "100px", md: "150px" },
                      }}
                      image={item.images[0]}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                        }}
                      >
                        {convertTime(item.createdAt)}
                      </Typography>
                      <ChildTitleNewBlog
                        sx={{
                          fontSize: { xs: "16px", md: "18px" },
                        }}
                      >
                        {item.title}
                      </ChildTitleNewBlog>

                      <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "14px", md: "16px" },
                          }}
                        >
                          <GrFormView /> {item.readTime} phút đọc/{item.views} views
                        </Typography>
                      </Typography>
                    </Box>
                  </BoxChild2NewBlog>
                ))}
            </Box>
          </BoxNewBlog>

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
        </Box>
      </Layout>
    </>
  );
};
export default BlogComponent;
export const getServerSideProps = async () => {
  await dbConnect();
  let newBlog = [];
  const test = await Promise.all([
    Blog.find({}).limit(4).select("-link -__v").sort("-_id"),
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {
      newBlog = data[0];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newBlog: JSON.stringify(newBlog),
    },
  };
};
