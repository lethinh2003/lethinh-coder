import { Box, Breadcrumbs, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

import Link from "next/link";
import Layout from "../../../components/Layout";
import dbConnect from "../../../database/dbConnect";
import System from "../../../models/System";
import BlogsOfLabel from "../../../components/blog/BlogsOfLabel";
const BlogComponent = (props) => {
  const router = useRouter();
  const { label } = router.query;

  return (
    <>
      <Head>
        <title>{`Blog lập trình viên - LT Blog`}</title>
        <meta name="description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />

        <meta property="og:title" content={`Blog lập trình viên - LT Blog`} />
        <meta property="og:description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.imgur.com/FnvSDKF.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`Blog lập trình viên - LT Blog`} />
        <meta property="twitter:description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="twitter:creator" content={"Thinh Le"} />
        <meta property="twitter:image" content={"https://i.imgur.com/FnvSDKF.png"} />
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
export const getServerSideProps = async () => {
  await dbConnect();
  let newBlog = [];
  const test = await Promise.all([
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {})
    .catch((err) => console.log(err));
  return {
    props: {},
  };
};
