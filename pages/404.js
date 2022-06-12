import { Box } from "@mui/material";
import Layout from "../components/Layout";
import Image from "next/image";
import Head from "next/head";
const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>404 Error - Không tìm thấy trang</title>
        <meta name="description" content="Không tìm thấy trang, 404 not found, lỗi tìm kiếm, lỗi trang" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />
        <meta property="og:title" content={`404 Error - Không tìm thấy trang`} />
        <meta property="og:description" content="Không tìm thấy trang, 404 not found, lỗi tìm kiếm, lỗi trang" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.imgur.com/eOPszwc.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`404 Error - Không tìm thấy trang`} />
        <meta property="twitter:description" content="Không tìm thấy trang, 404 not found, lỗi tìm kiếm, lỗi trang" />
        <meta property="twitter:creator" content={"Thinh Le"} />
        <meta property="twitter:image" content={"https://i.imgur.com/eOPszwc.png"} />
      </Head>
      <Layout>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center", padding: "20px" }}>
          <Box sx={{ maxWidth: "400px", width: "100%", height: "250px", position: "relative" }}>
            <Image
              src="https://i.imgur.com/bpfKcNg.png"
              objectFit="contain"
              layout="fill"
              alt="404 Error - Không tìm thấy trang"
            />
          </Box>
        </Box>
      </Layout>
    </>
  );
};
export default ErrorPage;
