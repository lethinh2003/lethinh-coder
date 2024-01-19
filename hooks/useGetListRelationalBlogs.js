import axios from "axios";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transfromDataRelationalContent } from "../utils/transformDataUseQueries";

const LIMIT_RESULTS = process.env.LIMIT_RESULTS * 1 || 10;

const callDataApi = async (results, sortQuery, pageParam, searchQuery, labelQuery) => {
  const listQuery = {
    labelQuery: labelQuery,
    sort: sortQuery,
    searchQuery: searchQuery,
    page: pageParam,
    results,
  };
  // Remove empty query
  for (const key of Object.keys(listQuery)) {
    if (!listQuery[key]) {
      listQuery[key] = null;
    }
  }

  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/blogs`, {
    params: listQuery,
  });
  return res.data;
};

const useGetListRelationalBlogs = ({
  fromBlogId,
  sortQuery = "",
  searchQuery = "",
  labelQuery = "",
  results = LIMIT_RESULTS,
}) => {
  const { data, isLoading, isFetching, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["get-relational-blogs", { fromBlogId, results, sortQuery, searchQuery, labelQuery }],
      ({ pageParam = 1 }) => {
        return callDataApi(results, sortQuery, pageParam, searchQuery, labelQuery);
      },
      {
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        getNextPageParam: (_lastPage, pages) => {
          if (pages[pages.length - 1].metadata.results === results) {
            return pages.length + 1;
          }
          return undefined;
        },
        select: (data) => transfromDataRelationalContent(data, fromBlogId),
      }
    );

  useEffect(() => {
    if (isError) {
      throw error;
    }
  }, [isError, error]);
  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
export default useGetListRelationalBlogs;
