import { Box, Breadcrumbs, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../../components/Layout";
import CodesOfLabel from "../../../components/code/CodesOfLabel";
const BlogComponent = ({ label }) => {
  return (
    <>
      <NextSeo
        title={`Danh sách source code thuộc ${label}`}
        description="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/source-code/label/${label}`,
          images: [
            {
              url: "https://i.imgur.com/t1ySawT.png",

              alt: `Danh sách source code thuộc ${label} `,
            },
          ],
        }}
        twitter={{
          site: `${process.env.NEXTAUTH_URL}/source-code/label/${label}`,
        }}
      />
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "20px",
            padding: "40px 0",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>
            <Link style={{ color: "inherit" }} href="/source-code">
              Source code
            </Link>

            <Typography color="text.primary">{label}</Typography>
          </Breadcrumbs>
          <CodesOfLabel label={label} />
        </Box>
      </Layout>
    </>
  );
};
export default BlogComponent;

export async function getServerSideProps(context) {
  const { params } = context;
  const { label } = params;
  if (!label) {
    return {
      redirect: {
        destination: "/source-code",
        permanent: false,
      },
    };
  }

  return {
    props: {
      label,
    },
  };
}
