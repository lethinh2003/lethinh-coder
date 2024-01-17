import axios from "axios";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";

const LIMIT_RESULTS = process.env.LIMIT_RESULTS * 1 || 10;

const callDataApi = async (sortQuery, pageParam, searchQuery) => {
  const results = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/codes?sort=${sortQuery}&searchQuery=${searchQuery}&page=${pageParam}&results=${LIMIT_RESULTS}`
  );
  return results.data;
};

const useGetListCodes = ({ sortQuery, searchQuery }) => {
  const { data, isLoading, isFetching, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["get-all-source-codes", sortQuery, searchQuery],
      ({ pageParam = 1 }) => {
        return callDataApi(sortQuery, pageParam, searchQuery);
      },
      {
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        getNextPageParam: (_lastPage, pages) => {
          if (pages[pages.length - 1].metadata.results === LIMIT_RESULTS) {
            return pages.length + 1;
          }
          return undefined;
        },
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
export default useGetListCodes;
