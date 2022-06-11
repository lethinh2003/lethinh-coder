import { Box, Button, Skeleton, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FilterCode from "../../components/code/FilterCode";
import ItemCode from "../../components/code/ItemCode";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
const SourceCode = () => {
  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });

  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
  });
  const [isEndLoadingMore, setIsEndLoadingMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cost, setCost] = useState("costs");
  const [date, setDate] = useState("-createdAt");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [sourceCode, setSourceCode] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const AllSourceCodeRef = useRef();
  let countPage = useRef(1);

  useEffect(() => {
    const getSourceCode = async () => {
      try {
        setIsLoading(true);
        const arraySort = [];
        if (cost) {
          arraySort.push(cost);
        }
        if (date) {
          arraySort.push(date);
        }
        const newArraySort = arraySort.join(",");

        const results = await axios.get(
          `${process.env.ENDPOINT_SERVER}/api/v1/source-codes?sort=${newArraySort}&page=${countPage.current}&results=${itemsPerPage}`
        );
        if (results.data.results === itemsPerPage) {
          setIsLoadMore(true);
          // setPageCount((prev) => prev + 1);
          countPage.current = countPage.current + 1;
        } else {
          setIsLoadMore(false);
        }
        if (results.data.results === 0) {
          setIsEndLoadingMore(true);
        } else {
          setIsEndLoadingMore(false);
        }
        setSourceCode(results.data.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    getSourceCode();
  }, []);
  const handleClickLoadMore = async () => {
    try {
      setIsLoadingMore(true);

      setIsLoadMore(false);
      const arraySort = [];
      if (cost) {
        arraySort.push(cost);
      }
      if (date) {
        arraySort.push(date);
      }
      const newArraySort = arraySort.join(",");

      const results = await axios.get(
        `${process.env.ENDPOINT_SERVER}/api/v1/source-codes?sort=${newArraySort}&page=${countPage.current}&results=${itemsPerPage}`
      );

      if (results.data.results === itemsPerPage) {
        setIsLoadMore(true);
        // setPageCount((prev) => prev + 1);
        countPage.current = countPage.current + 1;
      } else {
        setIsLoadMore(false);
      }
      if (results.data.results === 0) {
        setIsEndLoadingMore(true);
      } else {
        setIsEndLoadingMore(false);
      }
      setIsLoadingMore(false);

      setSourceCode((prev) => [...prev, ...results.data.data]);
    } catch (err) {
      console.log(err);
      setIsLoadingMore(false);
      setIsLoadMore(false);
    }
  };
  const BoxChild2NewBlog = styled(Box)({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  });
  return (
    <>
      <Head>
        <title>{`Danh sách source code miễn phí và có phí - LT Blog`}</title>
        <meta
          name="description"
          content="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        />
        <meta property="og:locale" content="vi_VN" />
        <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />
        <meta property="og:title" content={`Danh sách source code miễn phí và có phí - LT Blog`} />
        <meta
          property="og:description"
          content="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.imgur.com/Zvzfhl7.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`Danh sách source code miễn phí và có phí - LT Blog`} />
        <meta
          property="twitter:description"
          content="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        />
        <meta property="twitter:creator" content={"Thinh Le"} />
        <meta property="twitter:image" content={"https://i.imgur.com/Zvzfhl7.png"} />
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
          <TitleContent className="title" sx={{ fontFamily: "Bebas Neue", fontSize: "4rem", fontWeight: "bold" }}>
            All Source Code
          </TitleContent>

          <FilterCode
            cost={cost}
            setCost={setCost}
            date={date}
            setDate={setDate}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSourceCode={setSourceCode}
            countPage={countPage}
            setIsLoadMore={setIsLoadMore}
            itemsPerPage={itemsPerPage}
            setIsEndLoadingMore={setIsEndLoadingMore}
          />

          <CodeTitle
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
            }}
            ref={AllSourceCodeRef}
          >
            Kết quả
          </CodeTitle>
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
                sourceCode &&
                sourceCode.length > 0 &&
                sourceCode.map((item, i) => {
                  return <ItemCode key={i} item={item} />;
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

          {isLoadMore && (
            <Button variant="contained" onClick={() => handleClickLoadMore()}>
              Load more
            </Button>
          )}
          {isEndLoadingMore && (
            <Box
              as={motion.div}
              initial={{ scale: 1 }}
              animate={{ scale: 1.02 }}
              sx={{
                backgroundColor: "#374151",
                padding: "15px",
                borderRadius: "10px",
                fontSize: "2rem",
                color: "#ffffff",
              }}
            >
              Đã hết danh sách 👏🏼
            </Box>
          )}
        </Box>
      </Layout>
    </>
  );
};
export default SourceCode;
