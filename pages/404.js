import { Box } from "@mui/material";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Layout from "../components/Layout";
const ErrorPage = () => {
  return (
    <>
      <NextSeo
        title="404 Error - Không tìm thấy trang - LeThinh Blog"
        description="Không tìm thấy trang, 404 not found, lỗi tìm kiếm, lỗi trang"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/?error`,
          images: [
            {
              url: "https://i.imgur.com/eOPszwc.png",
              width: 700,
              height: 700,
              alt: "404 Error - Không tìm thấy trang - LeThinh Blog",
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/?error`,
          cardType: "summary_large_image",
        }}
      />
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
