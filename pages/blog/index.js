import { Box, Breadcrumbs, Typography } from "@mui/material";
import AllBlogs from "../../components/blog/AllBlogs";
import NewBlogs from "../../components/blog/NewBlogs";

import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../components/Layout";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
const BlogComponent = (props) => {
  let { newBlog } = props;
  newBlog = JSON.parse(newBlog);

  return (
    <>
      <NextSeo
        title="Blog lập trình viên - LeThinh Blog"
        description="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/blog`,
          images: [
            {
              url: "https://i.imgur.com/ipoUilM.png",
              width: 700,
              height: 700,
              alt: "Blog lập trình viên - LeThinh Blog",
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/blog`,
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
          <NewBlogs newBlog={newBlog} />
          <AllBlogs />
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
    Blog.find({ status: true }).limit(4).select("-link -__v").sort("-_id"),
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {
      newBlog = data[0];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      newBlog: JSON.stringify(newBlog),
    },
  };
};
