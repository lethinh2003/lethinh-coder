import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { NextSeo } from "next-seo";
import Link from "next/link";
import BlogsOfLabel from "../../../components/blog/BlogsOfLabel";
import Layout from "../../../components/Layout";
import dbConnect from "../../../database/dbConnect";
import System from "../../../models/System";
const BlogComponent = (props) => {
  const router = useRouter();
  const { label } = router.query;

  return (
    <>
      <NextSeo
        title={`Blog lập trình viên về ${label} - LeThinh Blog`}
        description="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/blog/label/${label}`,
          images: [
            {
              url: "https://i.imgur.com/ipoUilM.png",
              width: 700,
              height: 700,
              alt: `Blog lập trình viên về ${label} - LeThinh Blog`,
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/blog/label/${label}`,
          cardType: "summary_large_image",
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
