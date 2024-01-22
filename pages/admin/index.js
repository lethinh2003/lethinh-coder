import { Box } from "@mui/material";
import Head from "next/head";
import Layout from "../../components/admin/Layout";
import HistoryCode from "../../components/admin/panel/HistoryCode";
import Overview from "../../components/admin/panel/Overview";
import Users from "../../components/admin/panel/Users";
const Admin = () => {
  return (
    <>
      <Head>
        <title>Trang quản trị Admin</title>
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
            padding: { xs: "40px 10px", md: "40px 20px" },
          }}
        >
          <Overview />
          <HistoryCode />
          <Users />
        </Box>
      </Layout>
    </>
  );
};
export default Admin;
