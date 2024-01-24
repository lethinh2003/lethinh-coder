import { Box, Breadcrumbs, Typography } from "@mui/material";
import AllBlogs from "../../components/blog/AllBlogs";
import NewBlogs from "../../components/blog/NewBlogs";

import axios from "axios";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../components/Layout";
const BlogComponent = ({ newBlog, query }) => {
  return (
    <>
      <NextSeo
        title="Danh sách blog"
        description="Blog về lập trình, cuộc sống hằng ngày"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/blog`,
          images: [
            {
              url: "https://i.imgur.com/ipoUilM.png",
              alt: "Danh sách blog",
            },
          ],
        }}
        twitter={{
          site: `${process.env.NEXTAUTH_URL}/blog`,
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
          <AllBlogs query={query} />
        </Box>
      </Layout>
    </>
  );
};
export default BlogComponent;
export const getServerSideProps = async ({ query }) => {
  // Handle query
  const { sort } = query;
  if (!sort) {
    query.sort = "-createdAt";
  }

  // Get new blog

  const limitItems = 3;
  const latestSort = "-_id";
  const getNewBlogs = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/blogs?sort=${latestSort}&results=${limitItems}`
  );
  const data = getNewBlogs.data.data;
  return {
    props: {
      newBlog: data,
      query,
    },
  };
};
