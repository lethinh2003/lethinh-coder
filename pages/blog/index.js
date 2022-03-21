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
  Typography,
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
                  <Link href={`/source-code/${item.slug}`}>
                    <CardContentCodeTitle component="div" className="code-title">
                      {item.title}
                    </CardContentCodeTitle>
                  </Link>
                  <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                    {item.desc}
                  </Typography>
                  <Typography sx={{ marginTop: "20px", display: "flex" }}>
                    {item.costs > 0 && (
                      <CodeButton variant="outlined">
                        <NumberFormat
                          value={item.costs}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          suffix={" VNĐ"}
                        />{" "}
                      </CodeButton>
                    )}
                    {item.costs === 0 && <CodeButton variant="outlined">Free</CodeButton>}
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
  const optionsPrice = [
    { label: "Giá giảm dần", key: "-costs" },
    { label: "Giá tăng dần", key: "costs" },
  ];
  const optionsLabel = [
    { label: "PHP", key: "php" },
    { label: "REACTJS", key: "reactjs" },
  ];
  const optionsDate = [
    { label: "Mới nhất", key: "-createdAt" },
    { label: "Cũ nhất", key: "createdAt" },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [sourceCode, setSourceCode] = useState([]);
  const [sourceCodeAll, setSourceCodeAll] = useState([]);
  const [valueCosts, setValueCosts] = useState("");
  const [inputValueCosts, setInputValueCosts] = useState("");
  const [valueLabels, setValueLabels] = useState("");
  const [inputValueLabels, setInputValueLabels] = useState("");
  const [valueDate, setValueDate] = useState(optionsDate[1]);
  const [inputValueDate, setInputValueDate] = useState("");
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const AllSourceCodeRef = useRef();
  useEffect(() => {
    const getSourceCode = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get("/api/blog");
        setSourceCode(results.data.data);
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
    setCurrentItems(sourceCode.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(sourceCode.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, sourceCode]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % sourceCode.length;
    setItemOffset(newOffset);
    window.scrollTo(0, AllSourceCodeRef.current.offsetTop);
  };

  const handleClickFilter = async () => {
    const arraySort = [];
    if (valueCosts) {
      arraySort.push(valueCosts.key);
    }
    if (valueDate) {
      arraySort.push(valueDate.key);
    }

    const newArraySort = arraySort.join(",");

    try {
      setIsLoading(true);
      const result = await axios.get(`/api/source-code?sort=${newArraySort}&label=${inputValueLabels.toLowerCase()}`);
      setSourceCode(result.data.data);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
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
            New Blog
          </BlogTitle>
          {/* <Box
            sx={{
              width: "100%",
              flexWrap: "wrap",
              bgcolor: "background.default",
              justifyContent: "space-between",
              color: "text.primary",
              gap: "10px",
              padding: "40px 20px",
              display: "grid",
              gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
            }}
          >
            {isLoading &&
              Array.from({ length: 4 }).map((item, i) => (
                <Card sx={{ minWidth: 200 }} key={i} className={`code-container`}>
                  <Skeleton variant="rectangular" width={"100%"} height={200} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton />
                    <Skeleton />
                  </Box>
                  <Box sx={{ p: 2, borderRadius: "20px" }}>
                    <Skeleton sx={{ borderRadius: "5px" }} variant="rectangular" width={100} height={50} />
                  </Box>
                  <Box sx={{ p: 2, display: "flex", gap: "10px" }}>
                    <Skeleton variant="rectangular" width={100} height={40} />
                    <Skeleton variant="rectangular" width={100} height={40} />
                  </Box>
                </Card>
              ))}
            {!isLoading &&
              sourceCode.length > 0 &&
              sourceCode.map((item, i) => {
                return (
                  <Card sx={{ minWidth: 200 }} key={i} className={`code-container`}>
                    <CardMedia
                      className="code-container__image"
                      component="img"
                      height="140"
                      image={item.images[0]}
                      alt={item.title}
                    />
                    <CardContent className="code-container__body">
                      <Typography
                        sx={{
                          fontFamily: "Noto Sans",
                          fontSize: "20px",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                        variant="h5"
                        component="div"
                      >
                        {item.title}
                      </Typography>

                      <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                        {item.desc}
                      </Typography>
                      <Typography sx={{ marginTop: "20px" }}>
                        {item.costs > 0 && (
                          <Button variant="contained" color="success">
                            <NumberFormat
                              value={item.costs}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              suffix={" VNĐ"}
                            />
                          </Button>
                        )}
                        {item.costs === 0 && (
                          <Button variant="contained">
                            Free <MoneyOffIcon />
                          </Button>
                        )}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{
                        paddingTop: "20px",
                      }}
                    >
                      <Button size="small" color="primary">
                        Share
                      </Button>
                      <Link href={`/source-code/${item.slug}`}>
                        <Button size="small" color="primary">
                          Chi tiết
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                );
              })}
          </Box> */}
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
