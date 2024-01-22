import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { KEY_GET_LIST_BLOG } from "../../configs/keyUseQuery";
const callDataApi = async () => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/blogs`);
  return res.data.data;
};

const useGetBlogs = () => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    [KEY_GET_LIST_BLOG],
    () => {
      return callDataApi();
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
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
  };
};
export default useGetBlogs;
