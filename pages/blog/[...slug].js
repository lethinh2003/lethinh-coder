import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import DescBlog from "../../components/blog/DescBlog";
import InfoBlog from "../../components/blog/InfoBlog";
import PostComment from "../../components/general/PostComment";
import RelationPosts from "../../components/general/RelationPosts";
import Layout from "../../components/Layout";
import MySelf from "../../components/Post/MySelf";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  const timeRefLoading = useRef(null);

  let { sourceBySlug, systemData } = props;
  const [blogData, setBlogData] = useState(JSON.parse(sourceBySlug));

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!blogData) {
      return (window.location.href = "/err?code=404");
      // return router.push("/");
    }
    const slug = router.query.slug.join("/");
    const data = JSON.parse(sourceBySlug);
    if (slug !== blogData.slug) {
      setBlogData(data);
    }
  }, [router.query.slug]);

  return (
    <>
      {blogData && (
        <>
          <Head>
            <title>{`${blogData.title} - LT Blog`}</title>
            <meta name="description" content={blogData.desc} />

            <meta name="keywords" content={`${blogData.keywords.join(", ")}`} />
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content="article" />
            <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />
            <meta property="og:title" content={`${blogData.title} - LT Blog`} />
            <meta property="og:description" content={blogData.desc} />
            <meta property="og:image" content={blogData.images[0]} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={`${blogData.title} - LT Blog`} />
            <meta property="twitter:description" content={blogData.desc} />
            <meta property="twitter:creator" content={"Thinh Le"} />
            <meta property="twitter:image" content={blogData.images[0]} />
          </Head>

          <Layout>
            <Box
              as={motion.div}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                bgcolor: "background.default",
                justifyContent: "center",
                color: "text.primary",
                gap: "10px",
                padding: "20px 0",
                width: "100%",
                maxWidth: { xs: "100%", md: "calc(100vw - 0px)" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  bgcolor: "background.default",
                  justifyContent: "center",
                  color: "text.primary",
                  gap: "10px",
                  padding: " 0",
                }}
              >
                <InfoBlog blogData={blogData} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    bgcolor: "background.default",
                    justifyContent: "space-between",
                    color: "text.primary",
                    gap: "10px",
                  }}
                >
                  <DescBlog blogData={blogData} />
                  <TableOfContent dataPost={blogData} />
                </Box>
              </Box>
              <PostComment status={status} session={session} postData={blogData} typePost={"blog"} />
              <MySelf />
              <RelationPosts data={blogData} typePost={"blog"} />
              <Tag data={blogData} />
            </Box>
          </Layout>
        </>
      )}
    </>
  );
};
export default DetailSourceCode;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const test = params.slug.join("/");
  await dbConnect();
  let sourceBySlug = [];
  let systemData;
  await Promise.all([
    Blog.findOneAndUpdate(
      { slug: { $in: test }, status: true },
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    ),
    System.findOneAndUpdate(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {
      sourceBySlug = data[0];
      systemData = data[1];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      sourceBySlug: JSON.stringify(sourceBySlug),
    },
  };
};
