import { Backdrop, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Layout from "../../../components/admin/Layout";
import CodeForm from "../../../components/admin/panel/CodeForm";
import { KEY_GET_DETAILED_CODE, KEY_GET_LIST_CODE } from "../../../configs/keyUseQuery";
import { TYPE_EDIT } from "../../../configs/typeCodeForm";
import useGetDetailedCode from "../../../hooks/admin/useGetDetailedCode";
import CodeService from "../../../services/client/admin/CodeService";

const Code = ({ codeID }) => {
  const queryClient = useQueryClient();
  const { data: dataCode, isLoading: isLoadingQuery } = useGetDetailedCode({
    codeId: codeID,
  });
  const [initDataCode, setInitDataCode] = useState(null);
  useEffect(() => {
    if (dataCode) {
      setInitDataCode((prev) => ({
        ...prev,
        title: dataCode.title,
        content: dataCode.content,
        link: dataCode.link,
        costs: dataCode.costs,
        images: dataCode.images,
        desc: dataCode.desc,
        status: dataCode.status,
        labels: dataCode.labels,
        keywords: dataCode.keywords,
        createdAt: dataCode.createdAt,
        updatedAt: dataCode.updatedAt,
      }));
    }
  }, [dataCode]);

  const handleEditCode = async (data) => {
    const response = await CodeService.updateDetailedCode({
      id: codeID,
      title: data.title,
      link: data.link,
      costs: data.costs,
      content: data.content,
      images: data.images.split(", "),
      desc: data.desc,
      status: data.status,
      labels: data.labels.split(", "),
      keywords: data.keywords.split(", "),
    });
    queryClient.invalidateQueries({ queryKey: [KEY_GET_DETAILED_CODE, { codeId: codeID }] });
    queryClient.invalidateQueries({ queryKey: KEY_GET_LIST_CODE, refetchInactive: true });

    return response;
  };

  return (
    <>
      <Head>
        <title>Chi Tiết Source Code - Trang quản trị Admin</title>
      </Head>
      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoadingQuery}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {initDataCode && (
          <CodeForm typeForm={TYPE_EDIT} initDataCode={initDataCode} handleSubmitForm={handleEditCode} />
        )}
      </Layout>
    </>
  );
};
export default Code;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const codeID = params.codeID;

  return {
    props: {
      codeID: codeID,
    },
  };
};
