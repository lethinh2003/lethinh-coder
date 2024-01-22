import { Backdrop, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Layout from "../../../components/admin/Layout";
import BlogForm from "../../../components/admin/panel/BlogForm";
import { KEY_GET_DETAILED_BLOG, KEY_GET_LIST_BLOG } from "../../../configs/keyUseQuery";
import { TYPE_EDIT } from "../../../configs/typeBlogForm";
import useGetDetailedBlog from "../../../hooks/admin/useGetDetailedBlog";
import BlogService from "../../../services/client/admin/BlogService";

const DetailedBlog = ({ blogID }) => {
  const queryClient = useQueryClient();
  const { data: dataBlog, isLoading: isLoadingQuery } = useGetDetailedBlog({
    blogId: blogID,
  });
  const [initDataBlog, setInitDataBlog] = useState(null);
  useEffect(() => {
    if (dataBlog) {
      setInitDataBlog((prev) => ({
        ...prev,
        title: dataBlog.title,
        content: dataBlog.content,
        images: dataBlog.images,
        desc: dataBlog.desc,
        status: dataBlog.status,
        labels: dataBlog.labels,
        keywords: dataBlog.keywords,
        createdAt: dataBlog.createdAt,
        updatedAt: dataBlog.updatedAt,
      }));
    }
  }, [dataBlog]);

  const handleEditBlog = async (data) => {
    const response = await BlogService.updateDetailedBlog({
      id: blogID,
      title: data.title,
      content: data.content,
      images: data.images.split(", "),
      desc: data.desc,
      status: data.status,
      labels: data.labels.split(", "),
      keywords: data.keywords.split(", "),
    });
    queryClient.invalidateQueries({ queryKey: [KEY_GET_DETAILED_BLOG, { blogId: blogID }] });
    queryClient.invalidateQueries({ queryKey: KEY_GET_LIST_BLOG, refetchInactive: true });

    return response;
  };

  return (
    <>
      <Head>
        <title>Chi Tiết Blog - Trang quản trị Admin</title>
      </Head>
      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoadingQuery}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {initDataBlog && (
          <BlogForm typeForm={TYPE_EDIT} initDataBlog={initDataBlog} handleSubmitForm={handleEditBlog} />
        )}
      </Layout>
    </>
  );
};
export default DetailedBlog;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const blogID = params.blogID;

  return {
    props: {
      blogID: blogID,
    },
  };
};
