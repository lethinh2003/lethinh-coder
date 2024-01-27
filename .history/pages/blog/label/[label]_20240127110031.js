import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../../components/Layout";
import BlogsOfLabel from "../../../components/blog/BlogsOfLabel";
import dbConnect from "../../../database/dbConnect";
import System from "../../../models/System";
const BlogComponent = ({label}) => {


  return (
    <>
      <NextSeo
        title={`Danh sách blog về ${label}`}
        description="Blog về lập trình, cuộc sống hằng ngày"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/blog/label/${label}`,
          images: [
            {
              url: "https://i.imgur.com/ipoUilM.png",
              alt: `Blog lập trình viên về ${label}`,
            },
          ],
        }}
        twitter={{
          site: `${process.env.NEXTAUTH_URL}/blog/label/${label}`,
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

            <Typography color="text.primary">Blog</Typography>
          </Breadcrumbs>
          <BlogsOfLabel label={label} />
        </Box>
      </Layout>
    </>
  );
};
export default BlogComponent;
export const getServerSideProps = async ({ params }) => {
  const { label } = params;

 if (!label) {
    return {
      redirect: {
        destination: "/blog",
        permanent: false,
      },
    };
  }

  return {
    props: {
      label,
    },
  };
};
