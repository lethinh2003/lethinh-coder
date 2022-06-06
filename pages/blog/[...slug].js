import { Backdrop, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CommentsBlog from "../../components/blog/CommentsBlog";
import DescBlog from "../../components/blog/DescBlog";
import InfoBlog from "../../components/blog/InfoBlog";
import MySelf from "../../components/code/MySelf";
import SummaryCode from "../../components/code/SummaryCode";
import Layout from "../../components/Layout";
import dbConnect from "../../database/dbConnect";
import Blog from "../../models/Blog";
import System from "../../models/System";
import { useSelector } from "react-redux";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  const dataSystem = useSelector((state) => state.system.data);
  let { sourceBySlug } = props;
  const [blogData, setBlogData] = useState(JSON.parse(sourceBySlug));
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (blogData.length === 0) {
      return router.push("/");
    }
    const slug = router.query.slug.join("/");
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get("/api/blog/" + slug);
        setBlogData(results.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    // fetchAPI();
  }, [router]);

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
            <meta property="og:title" content={`${blogData.title} - LT Blog`} />
            <meta property="og:description" content={blogData.desc} />
            <meta property="og:image" content={blogData.images[0]} />
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
                  <SummaryCode sourceCode={blogData} />
                </Box>
              </Box>
              <CommentsBlog status={status} session={session} blogData={blogData} router={router} />
              <MySelf dataSystem={dataSystem} />
              {/* <RelationCode sourceCodeRelationship={sourceCodeRelationship} /> */}
              {/* <Tag blogData={blogData} /> */}
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
