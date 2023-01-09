import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { NextSeo } from "next-seo";
import Link from "next/link";
import CodesOfLabel from "../../../components/code/CodesOfLabel";
import Layout from "../../../components/Layout";
import dbConnect from "../../../database/dbConnect";
import System from "../../../models/System";
const BlogComponent = (props) => {
  const router = useRouter();
  const { label } = router.query;

  return (
    <>
      <NextSeo
        title={`Danh sách source code thuộc ${label}  - LT Blog`}
        description="Danh sách toàn bộ source code được đăng tải, bao gồm các code free và mất phí. Code chất lượng, đã qua kiểm định và code sẽ được check thường xuyên về vấn đề lỗi - Lethinh Blog"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/source-code/label/${label}`,
          images: [
            {
              url: "https://i.imgur.com/t1ySawT.png",
              width: 700,
              height: 700,
              alt: `Danh sách source code thuộc ${label}  - LT Blog`,
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/source-code/label/${label}`,
          cardType: "summary_large_image",
        }}
      />
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "20px",
            padding: "40px 0",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>

            <Typography color="text.primary">Source code</Typography>
          </Breadcrumbs>
          <CodesOfLabel label={label} />
        </Box>
      </Layout>
    </>
  );
};
export default BlogComponent;
export const getServerSideProps = async () => {
  await dbConnect();
  let newBlog = [];
  const test = await Promise.all([
    System.updateMany(
      {},
      { $inc: { home_views: 1 } },
      {
        new: true,
      }
    ),
  ])
    .then((data) => {})
    .catch((err) => console.log(err));
  return {
    props: {},
  };
};
