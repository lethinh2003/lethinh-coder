import { Box } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Info from "../../components/users/Info";
import Menu from "../../components/users/Menu";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import SocketContext from "../../context/socket";
import { useQuery } from "react-query";

const AccountDetail = () => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { account } = router.query;

  const [user, setUser] = useState(null);
  const callDataApi = async (account) => {
    if (!account) {
      return null;
    }
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/users?account=${account}`);
    return results.data;
  };
  const getListQuery = useQuery(["get-detail-user", account], () => callDataApi(account), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
  const { data, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
  useEffect(() => {
    if (error && error.response) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);
  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Profile {account}</title>
      </Head>

      <Layout>
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              bgcolor: "background.default",
              justifyContent: "center",
              color: "text.primary",
              gap: "10px",
            }}
          >
            <Info user={user} isLoading={isLoading} account={account} />
            <Menu user={user} socket={socket} />
          </Box>
        </>
      </Layout>
    </>
  );
};
export default AccountDetail;
