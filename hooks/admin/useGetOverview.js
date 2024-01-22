import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";

const callDataApi = async () => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/overview`);
  return res.data.data;
};

const useGetOverview = () => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ["get-admin-overview"],
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
export default useGetOverview;
