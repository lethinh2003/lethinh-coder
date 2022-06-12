import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { Typography, Box } from "@mui/material";
import Head from "next/head";
const UnsubscribeEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    if (token) {
      const unsubscribeEmail = async () => {
        try {
          const res = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/subscribes/unsubscribe`, {
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
