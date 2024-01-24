import { Box } from "@mui/material";
import { motion } from "framer-motion";

import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../components/Layout";
import MySelf from "../../components/Post/MySelf";
import TableOfContent from "../../components/Post/TableOfContent";
import Tag from "../../components/Post/Tag";
import DescBlog from "../../components/blog/DescBlog";
import RelationalBlog from "../../components/blog/RelationalBlog";
import dbConnect from "../../database/dbConnect";
import BlogRepository from "../../models/repositories/BlogRepository";
import RedisService from "../../services/client/RedisService";
const DetailBlog = ({ blogData, dataSystem }) => {
  return (
    <>
      {blogData && (
        <>
          <NextSeo
            title={`${blogData.title}`}
            description={`${blogData.desc}`}
            openGraph={{
              type: "article",
              locale: "vi_VN",
              url: `${process.env.NEXTAUTH_URL}/blog/${blogData.slug}`,
              images: [
                {
                  url: blogData.images[0],
                  alt: `${blogData.title}`,
                },
              ],
            }}
            twitter={{
              site: `${process.env.NEXTAUTH_URL}/blog/${blogData.slug}`,
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
                  padding: " 0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link style={{ color: "inherit" }} href="/">
                      Home
                    </Link>
                    <Link style={{ color: "inherit" }} href="/blog">
                      Blog
                    </Link>
                    <Typography color="text.primary">{blogData.title}</Typography>
                  </Breadcrumbs>
                </Box>

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
              <MySelf dataSystem={dataSystem} />
              <RelationalBlog labels={blogData.labels} blogId={blogData._id} />
              <Tag data={blogData} />
            </Box>
          </Layout>
        </>
      )}
    </>
  );
};
export default DetailBlog;
export const getServerSideProps = async (context) => {
  const { params } = context;
  await dbConnect();
  const dataSystem = await RedisService.getDataSystem();
  const slug = params.slug.join("/");

  const getDetailedBlog = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/blogs/${slug}`);
  const sourceBySlug = getDetailedBlog.data?.data;

  if (!sourceBySlug) {
    return {
      notFound: true,
    };
  }
  // Increase views
  await BlogRepository.findOneAndUpdate({
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
      blogData: sourceBySlug,
      dataSystem,
    },
  };
};
