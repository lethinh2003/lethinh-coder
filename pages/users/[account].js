import { Box, Breadcrumbs, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import Info from "../../components/users/Info";
const BoxTitle = styled(Typography)({
  fontFamily: "Noto sans",
  fontSize: "2.5rem",
  fontWeight: "bold",
});
const AccountDetail = ({ account }) => {
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

          <Info account={account} />
        </Box>
      </Layout>
    </>
  );
};
export default AccountDetail;

export async function getServerSideProps({ params }) {
  const { account } = params;
  return {
    props: {
      account,
    },
  };
}
