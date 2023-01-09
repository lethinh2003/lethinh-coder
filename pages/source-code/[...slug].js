import { Box } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
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
          <NextSeo
            title={`${sourceCode.title} - LT Blog`}
            description={`${sourceCode.desc} - LT Blog`}
            openGraph={{
              type: "article",
              locale: "vi_VN",
              url: `${process.env.NEXTAUTH_URL}/source-code/${sourceCode.slug}`,
              images: [
                {
                  url: sourceCode.images[0],
                  width: 700,
                  height: 700,
                  alt: `${sourceCode.desc} - LT Blog`,
                },
              ],
            }}
            twitter={{
              handle: "Thinh Le",
              site: `${process.env.NEXTAUTH_URL}/source-code/${sourceCode.slug}`,
              cardType: "summary_large_image",
            }}
          />

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
