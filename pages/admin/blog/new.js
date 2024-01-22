import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { useQueryClient } from "react-query";
import Layout from "../../../components/admin/Layout";
import BlogForm from "../../../components/admin/panel/BlogForm";
import { KEY_GET_LIST_BLOG } from "../../../configs/keyUseQuery";
import { TYPE_ADD_NEW } from "../../../configs/typeBlogForm";
import BlogService from "../../../services/client/admin/BlogService";

export default function MyEditor() {
  const queryClient = useQueryClient();
  const [initDataBlog, setInitDataBlog] = useState({
    title: "",
    content: "",
    images: [],
    desc: "",
    status: true,
    labels: [],
    keywords: [],
    createdAt: null,
    updatedAt: null,
  });

  const handleCreateBlog = async (data) => {
    const response = await BlogService.createNewBlog({
      title: data.title,
      content: data.content,
      images: data.images.split(", "),
      desc: data.desc,
      status: data.status,
      labels: data.labels.split(", "),
      keywords: data.keywords.split(", "),
    });
    queryClient.invalidateQueries({ queryKey: KEY_GET_LIST_BLOG, refetchInactive: true });

    return response;
  };

  return (
    <>
      <Head>
        <title>New Blog - Trang quản trị Admin</title>
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
            padding: "40px 20px",
          }}
        >
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
          >
            New Blog
          </Typography>
        </Box>
        <BlogForm typeForm={TYPE_ADD_NEW} initDataBlog={initDataBlog} handleSubmitForm={handleCreateBlog} />
      </Layout>
    </>
  );
}
