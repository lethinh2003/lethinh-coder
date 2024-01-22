import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { useQueryClient } from "react-query";
import Layout from "../../../components/admin/Layout";
import CodeForm from "../../../components/admin/panel/CodeForm";
import { KEY_GET_LIST_CODE } from "../../../configs/keyUseQuery";
import { TYPE_ADD_NEW } from "../../../configs/typeCodeForm";
import CodeService from "../../../services/client/admin/CodeService";

export default function MyEditor() {
  const queryClient = useQueryClient();
  const [initDataCode, setInitDataCode] = useState({
    title: "",
    link: "",
    costs: 0,
    content: "",
    images: [],
    desc: "",
    status: true,
    labels: [],
    keywords: [],
    createdAt: null,
    updatedAt: null,
  });

  const handleCreateCode = async (data) => {
    const response = await CodeService.createNewCode({
      link: data.link,
      costs: data.costs,
      title: data.title,
      content: data.content,
      images: data.images.split(", "),
      desc: data.desc,
      status: data.status,
      labels: data.labels.split(", "),
      keywords: data.keywords.split(", "),
    });
    queryClient.invalidateQueries({ queryKey: KEY_GET_LIST_CODE, refetchInactive: true });

    return response;
  };

  return (
    <>
      <Head>
        <title>New Source Code - Trang quản trị Admin</title>
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
            New Source Code
          </Typography>
        </Box>
        <CodeForm typeForm={TYPE_ADD_NEW} initDataCode={initDataCode} handleSubmitForm={handleCreateCode} />
      </Layout>
    </>
  );
}
