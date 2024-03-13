import { yupResolver } from "@hookform/resolvers/yup";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogContentText,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Ckeditor from "../../../components/general/Ckeditor";
import { TYPE_ADD_NEW } from "../../../configs/typeBlogForm";
import convertTime from "../../../utils/convertTime";

const BlogForm = ({ typeForm = TYPE_ADD_NEW, initDataBlog, handleSubmitForm }) => {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const srcAvatarImage = file ? URL.createObjectURL(file) : "";
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Desc is required"),
    images: Yup.string(),
    keywords: Yup.string().required("Keywords is required"),
    content: Yup.string().required("Content is required"),
    labels: Yup.string().required("Labels is required"),
    status: Yup.boolean(),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm(formOptions);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!file && typeForm === TYPE_ADD_NEW) {
        throw new Error("Vui lòng up ảnh đại diện");
      }
      // Upload Avatar Image
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadFile = await axios.post(`/api/v1/admin/upload-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const filePath = uploadFile.data.data;
        setValue("images", filePath, {
          shouldValidate: true,
        });
      }
      const response = await handleSubmitForm(data);
      if (typeForm === TYPE_ADD_NEW) {
        reset();
      }

      toast.success(response.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
        <FormControl>
          <Typography component={"label"} htmlFor="image-avatar">
            Ảnh đại diện
          </Typography>
          <input id="image-avatar" type="file" onChange={handleFileChange} />
          {file && (
            <>
              <Typography>Preview</Typography>
              <img
                src={srcAvatarImage}
                style={{
                  width: "10rem",
                  height: "10rem",
                  objectFit: "cover",
                }}
              />
            </>
          )}
          {initDataBlog.images[0] && (
            <>
              <Typography>Ảnh hiện tại</Typography>
              <img
                src={initDataBlog.images[0]}
                style={{
                  width: "10rem",
                  height: "10rem",
                  objectFit: "cover",
                }}
              />
            </>
          )}
        </FormControl>
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
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="Title"
                variant="outlined"
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initDataBlog.title}
          />
          <Controller
            name="desc"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="Desc"
                variant="outlined"
                error={errors.desc ? true : false}
                helperText={errors.desc ? errors.desc.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initDataBlog.desc}
          />

          {/* <Controller
            name="images"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="Images"
                variant="outlined"
                error={errors.images ? true : false}
                helperText={errors.images ? errors.images.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initDataBlog.images.join(", ")}
          /> */}
          <Controller
            name="keywords"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="Keywords"
                variant="outlined"
                error={errors.keywords ? true : false}
                helperText={errors.keywords ? errors.keywords.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initDataBlog.keywords.join(", ")}
          />
          <Controller
            name="labels"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="Labels"
                variant="outlined"
                error={errors.labels ? true : false}
                helperText={errors.labels ? errors.labels.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initDataBlog.labels.join(", ")}
          />
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value, ref, ...field } }) => (
              <Ckeditor content={value} setContent={onChange} setIsLoadingUploadImage={setIsLoadingUploadImage} />
            )}
            defaultValue={initDataBlog.content}
          />
          {initDataBlog.createdAt && (
            <TextField fullWidth label="Thời gian" defaultValue={convertTime(initDataBlog.createdAt)} disabled />
          )}

          {initDataBlog.updatedAt && (
            <TextField
              fullWidth
              label="Cập nhật"
              defaultValue={!initDataBlog.updatedAt ? "Chưa cập nhật" : convertTime(initDataBlog.updatedAt)}
              disabled
            />
          )}

          <Controller
            name="status"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <DialogContentText sx={{ pt: 2 }}>
                Hiển thị
                <Checkbox defaultChecked={initDataBlog.status} {...field} />{" "}
              </DialogContentText>
            )}
            defaultValue={initDataBlog.status}
          />

          <DialogContentText sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
            <Button
              sx={{
                pointerEvents: isLoadingUploadImage ? "none" : "visible",
                opacity: isLoadingUploadImage ? "0.7" : "1",
              }}
              variant="outlined"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {isLoadingUploadImage ? "Đang tải ảnh..." : "Áp dụng"}
            </Button>
          </DialogContentText>
        </form>
      </Box>
    </>
  );
};
export default BlogForm;
