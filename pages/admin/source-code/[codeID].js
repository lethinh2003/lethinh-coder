import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, Box, Button, Checkbox, CircularProgress, DialogContentText, TextField } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Layout from "../../../components/admin/Layout";
import Modal from "../../../components/homePage/Modal";
import convertTime from "../../../utils/convertTime";

const Code = ({ codeID }) => {
  const { data: session, status } = useSession();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Desc is required"),
    link: Yup.string().required("Link is required"),
    images: Yup.string().required("Images is required"),
    keywords: Yup.string().required("Keywords is required"),
    labels: Yup.string().required("Labels is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);
  console.log(codeID);

  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState("");
  const editorRef = useRef();
  const editorContentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const [dataCode, setDataCode] = useState(null);
  const [dataStatus, setDataStatus] = useState(true);
  const [dataContent, setDataContent] = useState("");
  useEffect(() => {
    const getSource = async () => {
      try {
        setIsLoading(true);
        const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/source-codes/detail/${codeID}`);
        setDataCode(results.data.data);
        setDataStatus(results.data.data.status);
        editorContentRef.current = results.data.data.content;

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    };
    if (status === "authenticated") {
      getSource();
    }
  }, [status]);
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("../../../ckeditor5-34.1.0-8ogafsbogmr7"),
    };
    setEditorLoaded(true);
  }, []);
  console.log(dataContent);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/admin/source-codes/detail/${codeID}`, {
        id: codeID,
        title: data.title,
        content: editorContentRef.current,
        link: data.link,
        costs: data.costs,
        images: data.images.split(", "),
        desc: data.desc,
        status: dataStatus,
        labels: data.labels.split(", "),
        keywords: data.keywords.split(", "),
      });
      toast.success(response.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };
  const handleChange = (event) => {
    setDataStatus(event.target.checked);
  };

  return (
    <>
      <Head>
        <title>Chi Tiết Source Code - Trang quản trị Admin</title>
      </Head>
      <Layout>
        {dataCode && (
          <>
            <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Modal title={"Tin từ hệ thống"} isModal={isModal} setIsModal={setIsModal}>
              <DialogContentText>{text}</DialogContentText>
            </Modal>
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
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "15px",
                }}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Title"
                      variant="outlined"
                      error={errors.title ? true : false}
                      helperText={errors.title ? errors.title.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.title}
                />
                <Controller
                  name="desc"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Desc"
                      variant="outlined"
                      error={errors.desc ? true : false}
                      helperText={errors.desc ? errors.desc.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.desc}
                />
                <Controller
                  name="link"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Link"
                      variant="outlined"
                      error={errors.link ? true : false}
                      helperText={errors.link ? errors.link.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.link}
                />
                <Controller
                  name="costs"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Giá"
                      variant="outlined"
                      type="number"
                      error={errors.costs ? true : false}
                      helperText={errors.costs ? errors.costs.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.costs}
                />
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Images"
                      variant="outlined"
                      error={errors.images ? true : false}
                      helperText={errors.images ? errors.images.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.images.join(", ")}
                />
                <Controller
                  name="keywords"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Keywords"
                      variant="outlined"
                      error={errors.keywords ? true : false}
                      helperText={errors.keywords ? errors.keywords.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.keywords.join(", ")}
                />
                <Controller
                  name="labels"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Labels"
                      variant="outlined"
                      error={errors.labels ? true : false}
                      helperText={errors.labels ? errors.labels.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={dataCode.labels.join(", ")}
                />

                {!editorLoaded && <div>Editor loading</div>}
                {editorLoaded && editorContentRef.current && (
                  <Box sx={{ width: "100%", color: "black", pt: 2, fontSize: "2rem" }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorContentRef.current}
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        editorContentRef.current = data;
                      }}
                    />
                  </Box>
                )}

                <TextField fullWidth label="Thời gian" defaultValue={convertTime(dataCode.createdAt)} disabled />

                <TextField
                  fullWidth
                  label="Cập nhật"
                  defaultValue={!dataCode.updatedAt ? "Chưa cập nhật" : convertTime(dataCode.updatedAt)}
                  disabled
                />

                <DialogContentText sx={{ pt: 2 }}>
                  Hiển thị
                  <Checkbox checked={dataStatus} defaultChecked={dataCode.status} onChange={handleChange} />{" "}
                </DialogContentText>

                <DialogContentText sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
                  <Button variant="outlined" type="submit" onClick={handleSubmit(onSubmit)}>
                    Chỉnh sửa
                  </Button>
                </DialogContentText>
              </form>
            </Box>
          </>
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