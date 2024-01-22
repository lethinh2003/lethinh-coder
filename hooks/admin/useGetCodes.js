import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { KEY_GET_LIST_CODE } from "../../configs/keyUseQuery";
const callDataApi = async () => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/codes`);
  return res.data.data;
};

const useGetCodes = () => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    [KEY_GET_LIST_CODE],
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
export default useGetCodes;
