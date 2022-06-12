import { Box } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentsCode from "../../components/code/CommentsCode";
import DescCode from "../../components/code/DescCode";
import ImagesCode from "../../components/code/ImagesCode";
import InfoCode from "../../components/code/InfoCode";
import MySelf from "../../components/Post/MySelf";
import RelationCode from "../../components/code/RelationCode";
import Layout from "../../components/Layout";
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
                padding: "40px 0",
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
                  padding: "40px 0",
                }}
              >
                <InfoCode sourceCode={sourceCode} />
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
              <CommentsCode status={status} session={session} sourceCode={sourceCode} router={router} />
              <MySelf />
              <RelationCode data={sourceCode} />
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
