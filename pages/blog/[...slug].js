import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import CommentsBlog from "../../components/blog/CommentsBlog";
import DescBlog from "../../components/blog/DescBlog";
import InfoBlog from "../../components/blog/InfoBlog";
import MySelf from "../../components/Post/MySelf";
import Layout from "../../components/Layout";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
import RelationBlogs from "../../components/blog/RelationBlogs";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  const timeRefLoading = useRef(null);

  const dataSystem = useSelector((state) => state.system.data);
  let { sourceBySlug } = props;
  const [blogData, setBlogData] = useState(JSON.parse(sourceBySlug));
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!blogData) {
      return router.push("/");
    }
    const slug = router.query.slug.join("/");
  }, [router]);

  useEffect(() => {
    if (!blogData) {
      return router.push("/");
    }
    const slug = router.query.slug.join("/");
    const data = JSON.parse(sourceBySlug);
    if (slug !== blogData.slug) {
      setBlogData(data);
    }
  }, [router.query.slug]);
  useEffect(() => {
    setIsLoading(false);
    timeRefLoading.current = setTimeout(() => {
      setIsLoading(true);
    }, 500);
    return () => {
      clearTimeout(timeRefLoading.current);
    };
  }, [blogData]);

  const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <>
      {blogData && (
        <>
          <Head>
            <title>{`${blogData.title} - LT Blog`}</title>
            <meta name="description" content={blogData.desc} />
            {dataSystem && (
              <meta name="keywords" content={`${dataSystem.meta_keywords},  ${blogData.keywords.join(", ")}`} />
            )}
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content="article" />
            <meta property="fb:app_id" content={process.env.FACEBOOK_APPID} />
            <meta property="og:title" content={`${blogData.title} - LT Blog`} />
            <meta property="og:description" content={blogData.desc} />
            <meta property="og:image" content={blogData.images[0]} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
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
              }}
            >
              <Box
                sx={{
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

                    bgcolor: "background.default",
                    justifyContent: "center",
                    color: "text.primary",
                    gap: "10px",
                  }}
                >
                  <DescBlog blogData={blogData} />
                  <TableOfContent dataPost={blogData} />
                </Box>
              </Box>
              <CommentsBlog status={status} session={session} blogData={blogData} router={router} />
              <MySelf dataSystem={dataSystem} />
              <RelationBlogs data={blogData} />
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
    })
    .catch((err) => console.log(err));
  return {
    props: {
      sourceBySlug: JSON.stringify(sourceBySlug),
    },
  };
};
