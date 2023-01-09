import { Box, Breadcrumbs, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useQuery } from "react-query";
import Layout from "../../components/Layout";
import Info from "../../components/users/Info";
import Menu from "../../components/users/Menu";
import SocketContext from "../../context/socket";

const AccountDetail = () => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { account } = router.query;
  const callDataApi = async (account) => {
    if (!account) {
      return undefined;
    }
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/users?account=${account}`);
    return results.data;
  };
  const getListQuery = useQuery(["get-detail-user", account], () => callDataApi(account), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { data, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;

  const BoxTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });

  return (
    <>
      <Head>
        <title>Profile {account}</title>
      </Head>

      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: "40px 0px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>

            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>

          <BoxTitle
            component="h1"
            sx={{
              padding: { xs: "0px 10px", md: "0px 20px" },
              alignSelf: "flex-start",
            }}
          >
            Trang cá nhân
          </BoxTitle>
          {isErrorQuery && (
            <Typography
              sx={{
                color: "#ea5e5e",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Error: {error && error.response ? `${error.response.data.message}` : "Something went wrong"}
            </Typography>
          )}
          <Info user={data?.data} isLoading={isLoading} account={account} />
          <Menu user={data?.data} socket={socket} />
        </Box>
      </Layout>
    </>
  );
};
export default AccountDetail;
