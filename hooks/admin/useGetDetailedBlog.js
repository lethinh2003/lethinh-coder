import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { KEY_GET_DETAILED_BLOG } from "../../configs/keyUseQuery";

const callDataApi = async (blogId) => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/blogs/${blogId}`);
  return res.data.data;
};

const useGetDetailedBlog = ({ blogId }) => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    [KEY_GET_DETAILED_BLOG, { blogId }],
    () => {
      return callDataApi(blogId);
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
export default useGetDetailedBlog;
