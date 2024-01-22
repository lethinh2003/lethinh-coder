import { Box, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
const UnsubscribeEmail = ({ token }) => {
  useEffect(() => {
    if (token) {
      const unsubscribeEmail = async () => {
        try {
          const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/email-subscribers/unsubscribe`, {
            token: token,
          });
          toast.success(res.data.message);
        } catch (err) {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      };
      unsubscribeEmail();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Hủy đăng ký nhận thông báo từ email - LT Blog</title>
      </Head>
      <Layout>
        <Box
          sx={{
            width: "100%",
            flexWrap: "wrap",
            bgcolor: "background.default",
            justifyContent: "space-between",
            color: "text.primary",
            gap: "20px",
            padding: { xs: "20px 10px", md: "20px 20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: "Noto sans",
              fontSize: "2.5rem",
              fontWeight: "bold",
            }}
          >
            Hủy đăng ký nhận thông báo
          </Typography>
        </Box>
      </Layout>
    </>
  );
};
export default UnsubscribeEmail;
export async function getServerSideProps({ params }) {
  const { token } = params;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token,
    },
  };
}
