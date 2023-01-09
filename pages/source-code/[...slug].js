import { Box } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import DescCode from "../../components/code/DescCode";
import InfoCode from "../../components/code/InfoCode";
import PostComment from "../../components/general/PostComment";
import RelationPosts from "../../components/general/RelationPosts";
import Layout from "../../components/Layout";
import MySelf from "../../components/Post/MySelf";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import dbConnect from "../../database/dbConnect";
import Code from "../../models/Code";
import System from "../../models/System";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  const timeRefLoading = useRef(null);

  let { sourceBySlug, newSource, systemData } = props;
  const [sourceCode, setSourceCode] = useState(JSON.parse(sourceBySlug));
  const [sourceCodeRelationship, setSourceCodeRelationship] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!sourceCode) {
      return (window.location.href = "/err?code=404");

      // return router.push("/");
    }
    const slug = router.query.slug.join("/");
    const data = JSON.parse(sourceBySlug);
    if (slug !== sourceCode.slug) {
      setSourceCode(data);
    }
    const fetchAPI = async () => {
      try {
        const keywordRelationship = data.labels[Math.floor(Math.random() * data.labels.length)];
        const resultsRelation = await axios.get(`/api/source-code/relation-code?keyword=${keywordRelationship}`);
        setSourceCodeRelationship(resultsRelation.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    // fetchAPI();
  }, [router.query.slug]);

  return (
    <>
      {sourceCode && (
        <>
          <Head>
            <title>{`${sourceCode.title} - LT Blog`}</title>
            <meta name="description" content={sourceCode.desc} />

            <meta name="keywords" content={` ${sourceCode.keywords.join(", ")}`} />
            <meta property="og:locale" content="vi_VN" />
            <meta property="og:type" content="article" />

            <meta property="og:title" content={`${sourceCode.title} - LT Blog`} />
            <meta property="og:description" content={sourceCode.desc} />
            <meta property="og:image" content={sourceCode.images[0]} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={`${sourceCode.title} - LT Blog`} />
            <meta property="twitter:description" content={sourceCode.desc} />
            <meta property="twitter:creator" content={"Thinh Le"} />
            <meta property="twitter:image" content={sourceCode.images[0]} />
          </Head>

          <Layout>
            {/* <Backdrop sx={{ color: "#fff", zIndex: 99999, backdropFilter: "blur(3px)" }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop> */}
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
                }}
              >
                <InfoCode sourceCode={sourceCode} />
                <Box
                  className="thinhle"
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
                  <DescCode sourceCode={sourceCode} status={status} />
                  <TableOfContent dataPost={sourceCode} status={status} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: { xs: "10px", md: "20px" },
                  }}
                >
                  {/* <ImagesCode sourceCode={sourceCode} /> */}
                </Box>
              </Box>
              <PostComment status={status} session={session} postData={sourceCode} typePost={"code"} />
              <MySelf />
              <RelationPosts data={sourceCode} typePost="code" />
              <Tag data={sourceCode} />
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
  let systemData = [];
  await Promise.all([
    Code.findOneAndUpdate(
      { slug: { $in: test }, status: true },
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    ).select("-link"),
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
