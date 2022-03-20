import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useAxios = (axiosParams) => {
  const { data: session, status } = useSession();
  if (session && session.user.access_token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${session.user.access_token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      const result = await axios.request(params);
      setData(result.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams);
  }, []); // execute once only

  return { data, isLoading };
};
