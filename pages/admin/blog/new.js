import React, { useState, useEffect, useRef } from "react";
import validator from "validator";
import axios from "axios";
import Layout from "../../../components/admin/Layout";
import {
  Button,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Backdrop,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import Modal from "../../../components/homePage/Modal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function MyEditor() {
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

  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("../../../ckeditor5-build-with-htmlembed-master"),
    };
    setEditorLoaded(true);
  }, []);
  const onSubmit = async (dataForm) => {
    try {
      setIsLoading(true);
      const data = localStorage.getItem("postDataBlog") || null;
      const imagesArray = dataForm.images.split(", ");
      const labelsArray = dataForm.labels.split(", ");
      const keywordsArray = dataForm.keywords.split(", ");

      const response = await axios.post("/api/admin/blog", {
        title: dataForm.title,
        content: data,
        readTime: dataForm.readTime,
        images: imagesArray,
        labels: labelsArray,
        keywords: keywordsArray,
        desc: dataForm.desc,
      });
      setIsModal(true);
      setText(response.data.message);
      reset({ title: "", desc: "", readTime: 0, images: "", labels: "", keywords: "" });
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
          {editorLoaded && (
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
                  name="readTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      fullWidth
                      label="Read time"
                      type="number"
                      variant="outlined"
                      error={errors.readTime ? true : false}
                      helperText={errors.readTime ? errors.readTime.message : ""}
                      {...field}
                    />
                  )}
                  defaultValue={0}
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

                <Box sx={{ width: "100%", color: "black" }}>
                  <CKEditor
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
                <Button variant="outlined" type="submit" onClick={() => onSubmit()}>
                  Send
                </Button>
              </form>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
}
