import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, Box, Button, CircularProgress, DialogContentText, TextField, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import Layout from "../../../components/admin/Layout";
import Modal from "../../../components/homePage/Modal";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function MyEditor() {
  const dataSystem = useSelector((state) => state.system.data);

  const { data: session, status } = useSession();
  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Desc is required"),
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
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false);

  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("../../../ckeditor5-34.1.0-8ogafsbogmr7"),
    };
    setEditorLoaded(true);
  }, []);
  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);
            setIsLoadingUploadImage(true);

            fetch(`${process.env.ENDPOINT_SERVER}/api/v1/admin/upload-file`, {
              method: "post",
              body: body,
              headers: { Authorization: `Bearer ${session.user.access_token}` },
            })
              .then((res) => res.json())
              .then((res) => {
                setIsLoadingUploadImage(false);
                resolve({
                  default: res.data,
                });
              })
              .catch((err) => {
                if (err.response) {
                  setIsLoadingUploadImage(false);
                  toast.error(err.response.data.message);
                }

                reject(err);
              });
          });
        });
      },
    };
  };
  const uploadPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  };
  const onSubmit = async (dataForm) => {
    try {
      setIsLoading(true);
      const data = localStorage.getItem("postDataBlog") || null;
      const imagesArray = dataForm.images.split(", ");
      const labelsArray = dataForm.labels.split(", ");
      const keywordsArray = dataForm.keywords.split(", ");

      const response = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/admin/blogs`, {
        dataSystem,

        title: dataForm.title,
        content: data,
        images: imagesArray,
        labels: labelsArray,
        keywords: keywordsArray,
        desc: dataForm.desc,
      });
      setIsModal(true);
      setText(response.data.message);
      reset({ title: "", desc: "", images: "", labels: "", keywords: "" });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setIsModal(true);
        setText(err.response.data.message);
      }
    }
  };

  return (
    <>
      <Head>
        <title>New Blog - Trang quản trị Admin</title>
      </Head>
      <Layout>
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
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
          >
            New Blog
          </Typography>
          {!editorLoaded && <div>Editor loading</div>}
          {editorLoaded && session && session.user && (
            <>
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
                />

                <Box sx={{ width: "100%", color: "black", fontSize: "2rem" }}>
                  <CKEditor
                    config={{
                      extraPlugins: [uploadPlugin],
                    }}
                    editor={ClassicEditor}
                    data={localStorage.getItem("postDataBlog") || null}
                    onReady={(editor) => {
                      // You can store the "editor" and use when it is needed.
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      localStorage.setItem("postDataBlog", data);
                    }}
                  />
                </Box>
                <Button
                  sx={{
                    pointerEvents: isLoadingUploadImage ? "none" : "visible",
                    opacity: isLoadingUploadImage ? "0.7" : "1",
                  }}
                  onClick={onSubmit}
                  variant="outlined"
                  type="submit"
                >
                  {isLoadingUploadImage ? "Đang tải ảnh..." : "Tạo"}
                </Button>
              </form>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
}
