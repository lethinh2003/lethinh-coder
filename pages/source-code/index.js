import { Box, Button, Skeleton, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import FilterCode from "../../components/code/FilterCode";
import ItemCode from "../../components/code/ItemCode";
import Layout from "../../components/Layout";

const SourceCode = () => {
  const filterValues = useSelector((state) => state.filterValueSourceCode);
  const [cost, setCost] = useState(filterValues ? filterValues.costs : "costs");
  const [date, setDate] = useState(filterValues ? filterValues.date : "-createdAt");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const AllSourceCodeRef = useRef();
  useEffect(() => {
    setCost(filterValues ? filterValues.costs : "costs");
    setDate(filterValues ? filterValues.date : "-createdAt");
    console.log(filterValues, cost, date);
  }, [filterValues]);

  const callDataApi = async (sortQuery, pageParam) => {
    const results = await axios.get(
      `${process.env.ENDPOINT_SERVER}/api/v1/source-codes?sort=${sortQuery}&page=${pageParam}&results=${itemsPerPage}`
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
    ["get-all-source-codes", cost, date],
    ({ pageParam = 1 }) => {
      const arraySort = [];
      if (cost) {
        arraySort.push(cost);
      }
      if (date) {
        arraySort.push(date);
      }
      const newArraySort = arraySort.join(",");
      return callDataApi(newArraySort, pageParam);
    },
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
  return (
    <>
      <NextSeo
        title="Danh sách source code - LT Blog"
        description="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi - Lethinh Blog"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/source-code`,
          images: [
            {
              url: "https://i.imgur.com/t1ySawT.png",
              width: 700,
              height: 700,
              alt: "Danh sách source code - LT Blog",
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/source-code`,
          cardType: "summary_large_image",
        }}
      />
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
          <TitleContent className="title" sx={{ fontFamily: "Bebas Neue", fontSize: "2.5rem", fontWeight: "bold" }}>
            All Source Code
          </TitleContent>

          <FilterCode
            cost={cost}
            setCost={setCost}
            date={date}
            setDate={setDate}
            isFetching={isFetching}
            isLoading={isLoading}
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
        </Box>
      </Layout>
    </>
  );
};
export default SourceCode;
