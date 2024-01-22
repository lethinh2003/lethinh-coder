import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { KEY_GET_DETAILED_CODE } from "../../configs/keyUseQuery";

const callDataApi = async (codeId) => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/codes/${codeId}`);
  return res.data.data;
};

const useGetDetailedCode = ({ codeId }) => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    [KEY_GET_DETAILED_CODE, { codeId }],
    () => {
      return callDataApi(codeId);
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
export default useGetDetailedCode;
