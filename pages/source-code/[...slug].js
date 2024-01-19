import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../components/Layout";
import MySelf from "../../components/Post/MySelf";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import DescCode from "../../components/code/DescCode";
import InfoCode from "../../components/code/InfoCode";
import RelationalCode from "../../components/code/RelationalCode";

const DetailSourceCode = ({ sourceCode }) => {
  const { data: session, status } = useSession();

  return (
    <>
      {sourceCode && (
        <>
          <NextSeo
            title={`${sourceCode.title} - LeThinh Blog`}
            description={`${sourceCode.desc} - LeThinh Blog`}
            openGraph={{
              type: "article",
              locale: "vi_VN",
              url: `${process.env.NEXTAUTH_URL}/source-code/${sourceCode.slug}`,
              images: [
                {
                  url: sourceCode.images[0],
                  width: 700,
                  height: 700,
                  alt: `${sourceCode.desc} - LeThinh Blog`,
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
                <Breadcrumbs aria-label="breadcrumb">
                  <Link style={{ color: "inherit" }} href="/">
                    Home
                  </Link>
                  <Link style={{ color: "inherit" }} href="/source-code">
                    Source code
                  </Link>
                  <Typography color="text.primary">{sourceCode.title}</Typography>
                </Breadcrumbs>
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
                  <DescCode sourceCode={sourceCode} />
                  <TableOfContent dataPost={sourceCode} status={status} />
                </Box>
              </Box>
              <MySelf />
              <RelationalCode labels={sourceCode.labels} codeId={sourceCode._id} />
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
  const slug = params.slug.join("/");

  const getDetailedCode = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/codes/${slug}`);
  const sourceBySlug = getDetailedCode.data?.data;

  if (!sourceBySlug) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      sourceCode: sourceBySlug,
    },
  };
};
