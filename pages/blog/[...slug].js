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

const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  let { sourceBySlug, systemData } = props;
  const [blogData, setBlogData] = useState(JSON.parse(sourceBySlug));
  systemData = JSON.parse(systemData);
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
    fetchAPI();
  }, [router.query.slug, status]);

  return (
    <>
      {blogData.length > 0 && (
        <>
          <Head>
            <title>{`${blogData[0].title} - LT Blog`}</title>
            <meta name="description" content={blogData[0].desc} />
            {systemData.length > 0 && (
              <meta name="keywords" content={`${systemData[0].meta_keywords},  ${blogData[0].keywords.join(", ")}`} />
            )}
            <meta property="og:title" content={`${blogData[0].title} - LT Blog`} />
            <meta property="og:description" content={blogData[0].desc} />
            <meta property="og:image" content={blogData[0].images[0]} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
          </Head>

          <Layout>
            <Backdrop sx={{ color: "#fff", zIndex: 99999, backdropFilter: "blur(3px)" }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
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
                  className="thinhle"
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",

                    bgcolor: "background.default",
                    justifyContent: "center",
                    color: "text.primary",
                    gap: "10px",
                    padding: "40px 0",
                  }}
                >
                  <DescBlog blogData={blogData} status={status} />
                  <SummaryCode blogData={blogData} status={status} />
                </Box>
              </Box>
              <CommentsBlog status={status} session={session} blogData={blogData} router={router} />
              <MySelf systemData={systemData} />
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
  console.log("heheh");
  const { params } = context;
  const test = params.slug.join("/");
  await dbConnect();
  let sourceBySlug = [];
  let systemData = [];
  await Promise.all([
    Blog.find({ slug: { $in: test } }),
    System.find({}).select("-__v"),
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
    Blog.updateOne(
      {
        slug: { $in: test },
      },
      { $inc: { views: 1 } },
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
      systemData: JSON.stringify(systemData),
    },
  };
};
