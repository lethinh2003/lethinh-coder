import { Box } from "@mui/material";
import Head from "next/head";
import NewBlogs from "../../components/blog/NewBlogs";
import AllBlogs from "../../components/blog/AllBlogs";

import Layout from "../../components/Layout";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
const BlogComponent = (props) => {
  let { newBlog } = props;
  newBlog = JSON.parse(newBlog);

  return (
    <>
      <Head>
        <title>{`Blog lập trình viên - LT Blog`}</title>
        <meta name="description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:title" content={`Blog lập trình viên - LT Blog`} />
        <meta property="og:description" content="Blog về lập trình, cuộc sống hằng ngày - Lethinh Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.imgur.com/1YZrvwt.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
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
            gap: "10px",
            padding: "40px 0",
          }}
        >
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
    Blog.find({}).limit(4).select("-link -__v").sort("-_id"),
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
