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
        const results = await axios.get("/api/source-code");
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

  return (
    <>
      <Head>
        <title>{`Danh sách source code miễn phí và có phí - LT Blog`}</title>
        <meta
          name="description"
          content="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        />
        <meta property="og:title" content={`Danh sách source code miễn phí và có phí - LT Blog`} />
        <meta
          property="og:description"
          content="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        />
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

            <Typography color="text.primary">Source code</Typography>
          </Breadcrumbs>
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
            ref={AllSourceCodeRef}
          >
            All Source Code
          </Typography>
          {!isLoading && (
            <>
              <Box sx={{ p: 2, display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <Autocomplete
                  disablePortal
                  value={valueCosts}
                  onChange={(event, newValue) => {
                    setValueCosts(newValue);
                  }}
                  inputValue={inputValueCosts}
                  onInputChange={(event, newInputValue) => {
                    setInputValueCosts(newInputValue);
                  }}
                  options={optionsPrice}
                  isOptionEqualToValue={(option, value) => option.key === value.key}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Giá" />}
                />
                <Autocomplete
                  disablePortal
                  value={valueLabels}
                  onChange={(event, newValue) => {
                    setValueLabels(newValue);
                  }}
                  inputValue={inputValueLabels}
                  onInputChange={(event, newInputValue) => {
                    setInputValueLabels(newInputValue);
                  }}
                  options={optionsLabel}
                  isOptionEqualToValue={(option, value) => option.key === value.key}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Labels" />}
                />
                <Autocomplete
                  disablePortal
                  value={valueDate}
                  onChange={(event, newValue) => {
                    setValueDate(newValue);
                  }}
                  inputValue={inputValueDate}
                  onInputChange={(event, newInputValue) => {
                    setInputValueDate(newInputValue);
                  }}
                  options={optionsDate}
                  isOptionEqualToValue={(option, value) => option.key === value.key}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Thời gian" />}
                />
              </Box>
              <Button variant="contained" onClick={handleClickFilter}>
                Lọc
              </Button>
            </>
          )}
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