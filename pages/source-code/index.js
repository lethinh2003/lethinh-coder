import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import FilterCode from "../../components/code/FilterCode";
import DisplayListItem from "../../components/general/DisplayListItem";
import useGetListCodes from "../../hooks/useGetListCodes";
import handleQueryParams from "../../utils/handleQueryParams";

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

const SourceCode = ({ query }) => {
  const router = useRouter();
  const { sort, q } = query;

  const [filterValues, setFilterValues] = useState({
    costs: sort?.split(" ")?.[0] || "costs",
    date: sort?.split(" ")?.[1] || "-createdAt",
  });
  const [sortQuery, setSortQuery] = useState(sort);
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    // Join sort param
    setSortQuery(Object.values(filterValues).join(" "));
  }, [filterValues]);
  useEffect(() => {
    const queryParams = {
      sort: sortQuery,
      q: searchQuery,
    };
    const queryParamsString = handleQueryParams(queryParams);
    router.replace(`?${queryParamsString}`, null, {
      shallow: true,
    });
  }, [sortQuery, searchQuery]);

  const {
    data: dataQuery,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetListCodes({
    sortQuery,
    searchQuery,
  });

  return (
    <>
      <NextSeo
        title="Danh sách source code - LeThinh Blog"
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
              alt: "Danh sách source code - LeThinh Blog",
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
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />

          <CodeTitle
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
            }}
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
            <DisplayListItem
              hasNextPage={hasNextPage}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              dataQuery={dataQuery}
              fetchNextPage={fetchNextPage}
            />
          </Box>
        </Box>
      </Layout>
    </>
  );
};
export default SourceCode;

export async function getServerSideProps({ query }) {
  const { sort } = query;
  if (!sort) {
    query.sort = "costs -createdAt";
  }
  return {
    props: {
      query,
    },
  };
}
