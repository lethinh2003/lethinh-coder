import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";

const callDataApi = async () => {
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/admin/users`);
  return res.data.data;
};

const useGetUsers = () => {
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ["get-admin-list-users"],
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
export default useGetUsers;
