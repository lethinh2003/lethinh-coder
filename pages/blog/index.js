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

const Items = ({ currentItems, isLoading }) => {
  const CardCode = styled(Card)({
    padding: "15px",
    borderRadius: "20px",
    minWidth: 300,
    overflow: "unset",
    scrollSnapAlign: "center",
  });
  const CardContentCode = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  });
  const CardContentCodeTitle = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "30px",
    fontWeight: "bold",
  });
  const CodeTitleSecond = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "20px",
    fontWeight: "bold",
    opacity: 0.8,
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
    },

    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const BoxCodeTitle = styled(Box)({
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  });
  const CodeButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const GridBlog = styled(Box)({
    display: "grid",
    gridTemplateAreas: `
  'main main main second'
  'main main main third'
  '. . . four'`,
    gap: "10px",
  });
  const GridBlogFirst = styled(Box)({
    backgroundColor: "red",
    gridArea: "main",

    width: "200px",
  });
  const GridBlogSecond = styled(Box)({
    backgroundColor: "blue",
    gridArea: "second",
    height: "200px",
    width: "200px",
  });
  const GridBlogThird = styled(Box)({
    backgroundColor: "green",
    gridArea: "third",
    height: "200px",
    width: "200px",
  });
  const GridBlogFour = styled(Box)({
    backgroundColor: "yellow",
    gridArea: "four",
    height: "200px",
    width: "200px",
  });
  return (
    <>
      {/* <GridBlog>
        <GridBlogFirst />
        <GridBlogSecond />
        <GridBlogThird />
        <GridBlogFour />
      </GridBlog> */}
      <Box
        sx={{
          width: "100%",
          flexWrap: "wrap",
          bgcolor: "background.default",
          justifyContent: "space-between",
          color: "text.primary",
          gap: "10px",
          padding: "40px 20px",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {isLoading &&
          Array.from({ length: 4 }).map((item, i) => (
            <CardCode sx={{ minWidth: 200 }} key={i} className={`code-container`}>
              <Skeleton
                sx={{
                  borderRadius: "20px",
                }}
                variant="rectangular"
                width={"100%"}
                height={200}
              />
              <Box sx={{ padding: "10px 0" }}>
                <Skeleton height={50} />
                <Skeleton height={20} />
              </Box>
              <Box sx={{ padding: "10px 0", borderRadius: "20px" }}>
                <Skeleton sx={{ borderRadius: "5px" }} variant="rectangular" width={100} height={30} />
              </Box>
            </CardCode>
          ))}
        {!isLoading &&
          currentItems &&
          currentItems.length > 0 &&
          currentItems.map((item, i) => {
            return (
              <CardCode key={i}>
                <CardMedia
                  className="code-container__image"
                  component="img"
                  height="140"
                  image={item.images[0]}
                  alt={item.title}
                  sx={{
                    borderRadius: "20px",
                  }}
                />
                <CardContentCode>
                  <Link href={`/blog/${item.slug}`}>
                    <CardContentCodeTitle component="div" className="code-title">
                      {item.title}
                    </CardContentCodeTitle>
                  </Link>
                  <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                    {item.desc}
                  </Typography>
                </CardContentCode>
              </CardCode>
            );
          })}
      </Box>
    </>
  );
};
const SourceCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const AllSourceCodeRef = useRef();
  useEffect(() => {
    const getSourceCode = async () => {
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
    getSourceCode();
  }, []);
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(blogData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(blogData.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, blogData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogData.length;
    setItemOffset(newOffset);
    window.scrollTo(0, AllSourceCodeRef.current.offsetTop);
  };

  const BlogTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
    fontWeight: "bold",
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
            }}
          >
            Blog
          </BlogTitle>

          <Items currentItems={currentItems} isLoading={isLoading} />
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
export default SourceCode;
