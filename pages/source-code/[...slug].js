import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../components/Layout";
import MySelf from "../../components/Post/MySelf";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import DescCode from "../../components/code/DescCode";
import InfoCode from "../../components/code/InfoCode";
import RelationalCode from "../../components/code/RelationalCode";
import dbConnect from "../../database/dbConnect";
import RedisService from "../../services/client/RedisService";
import CodeService from "../../services/server/CodeService";

const DetailSourceCode = ({ sourceCode, dataSystem }) => {
  return (
    <>
      {sourceCode && (
        <>
          <NextSeo
            title={`${sourceCode.title}`}
            description={`${sourceCode.desc}`}
            openGraph={{
              type: "article",
              locale: "vi_VN",
              url: `${process.env.NEXTAUTH_URL}/source-code/${sourceCode.slug}`,
              images: [
                {
                  url: sourceCode.images[0],

                  alt: `${sourceCode.title}`,
                },
              ],
            }}
            twitter={{
              site: `${process.env.NEXTAUTH_URL}/source-code/${sourceCode.slug}`,
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
                  <TableOfContent dataPost={sourceCode} />
                </Box>
              </Box>
              <MySelf dataSystem={dataSystem} />
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

export async function getStaticPaths() {
  const handleGetAllSlugs = async () => {
    const sortQuery = "-createdAt";
    let query = {
      status: true,
    };
    let options = {};

    const select = "slug";
    const data = await CodeService.findAllCodes({
      query,
      sort: sortQuery,
      select,
      options,
    });
    return data;
  };
  await dbConnect();

  const sourceSlug = await handleGetAllSlugs();

  // Get the paths we want to pre-render based on posts
  const paths = sourceSlug.map((slug) => ({
    params: { slug: slug.slug.split("/") },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const handleGetDetailedCode = async () => {
    const slug = params.slug.join("/");
    let query = {
      status: true,
      slug: { $in: slug },
    };
    let options = {};

    const select = "-__v";
    const data = await CodeService.findDetailedCode({
      query,
      select,
      options,
    });
    return data;
  };

  const dataSystem = await RedisService.getDataSystem();

  const sourceBySlug = await handleGetDetailedCode();

  if (!sourceBySlug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      sourceCode: JSON.parse(JSON.stringify(sourceBySlug)),
      dataSystem,
    },
    revalidate: 60,
  };
}

/*
export const getServerSideProps = async (context) => {
  const { params } = context;
  await dbConnect();
  const dataSystem = await RedisService.getDataSystem();

  const slug = params.slug.join("/");

  const getDetailedCode = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/codes/${slug}`);
  const sourceBySlug = getDetailedCode.data?.data;

  if (!sourceBySlug) {
    return {
      notFound: true,
    };
  }

  // Increase views
  await CodeRepository.findOneAndUpdate({
    query: {
      slug,
    },
    update: {
      $inc: {
        views: 1,
      },
    },
  });

  return {
    props: {
      sourceCode: sourceBySlug,
      dataSystem,
    },
  };
};
*/
