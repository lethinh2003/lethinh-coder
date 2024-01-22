import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";

const callDataApi = async () => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/history-code`);
  return res.data.data;
};

const useGetHistoryDownloadCode = () => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ["get-admin-history-download-code"],
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
export default useGetHistoryDownloadCode;
