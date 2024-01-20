import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";

const callDataApi = async (account) => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/users/${account}`);
  return res.data.data;
};

const useGetInformationUser = ({ account }) => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ["get-detail-user", { account }],
    () => {
      return callDataApi(account);
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
export default useGetInformationUser;
