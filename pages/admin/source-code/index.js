import { Box, Button } from "@mui/material";
import Link from "next/link";
import Layout from "../../../components/admin/Layout";
import Code from "../../../components/admin/panel/Code";
import Head from "next/head";
import { useSession } from "next-auth/react";

const SourceCode = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Source Code - Trang quản trị Admin</title>
      </Head>
      <Layout>
        {status === "authenticated" && (
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
            <Link href="/admin/source-code/new">
              <Button variant="contained">Tạo mới</Button>
            </Link>
            <Code />
          </Box>
        )}
      </Layout>
    </>
  );
};
export default SourceCode;
