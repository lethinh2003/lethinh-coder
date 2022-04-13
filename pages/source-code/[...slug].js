import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import dbConnect from "../../database/dbConnect";
import Code from "../../models/Code";
import System from "../../models/System";
import axios from "axios";

import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Input,
} from "@mui/material";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import InfoCode from "../../components/code/InfoCode";
import DescCode from "../../components/code/DescCode";
import SummaryCode from "../../components/code/SummaryCode";
import CommentsCode from "../../components/code/CommentsCode";
import MySelf from "../../components/code/MySelf";
import RelationCode from "../../components/code/RelationCode";
import Tag from "../../components/code/Tag";
import ImagesCode from "../../components/code/ImagesCode";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();
  let { sourceBySlug, newSource, systemData } = props;
  const [sourceCode, setSourceCode] = useState(JSON.parse(sourceBySlug));
  systemData = JSON.parse(systemData);
  const [sourceCodeRelationship, setSourceCodeRelationship] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (sourceCode.length === 0) {
      return router.push("/");
    }
    const slug = router.query.slug.join("/");
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get("/api/source-code/" + slug);
        setSourceCode(results.data.data);
        const keywordRelationship =
          results.data.data[0].labels[Math.floor(Math.random() * results.data.data[0].labels.length)];
        const resultsRelation = await axios.get(`/api/source-code/relation-code?keyword=${keywordRelationship}`);
        setSourceCodeRelationship(resultsRelation.data.data);
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
      {sourceCode.length > 0 && (
        <>
          <Head>
            <title>{`${sourceCode[0].title} - LT Blog`}</title>
            <meta name="description" content={sourceCode[0].desc} />
            {systemData.length > 0 && (
              <meta name="keywords" content={`${systemData[0].meta_keywords},  ${sourceCode[0].keywords.join(", ")}`} />
            )}
            <meta property="og:title" content={`${sourceCode[0].title} - LT Blog`} />
            <meta property="og:description" content={sourceCode[0].desc} />
            <meta property="og:image" content={sourceCode[0].images[0]} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
          </Head>

          <Layout>
            {/* <Backdrop sx={{ color: "#fff", zIndex: 99999, backdropFilter: "blur(3px)" }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop> */}
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
                  <SummaryCode sourceCode={sourceCode} status={status} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: { xs: "10px", md: "20px" },
                  }}
                >
                  <ImagesCode sourceCode={sourceCode} status={status} />
                </Box>
              </Box>
              <CommentsCode status={status} session={session} sourceCode={sourceCode} router={router} />
              <MySelf systemData={systemData} />
              <RelationCode sourceCodeRelationship={sourceCodeRelationship} />
              <Tag sourceCode={sourceCode} />
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
    Code.find({ slug: { $in: test }, status: true }),
    System.find({}).select("-__v"),
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
    Code.updateOne(
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
