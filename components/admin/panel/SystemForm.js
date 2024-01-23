import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, Box, Button, CircularProgress, DialogContentText, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Ckeditor from "../../general/Ckeditor";

const SystemForm = ({ initData, handleSubmitForm }) => {
  const validationSchema = Yup.object().shape({
    myself_name: Yup.string().required("myself_name is required"),
    myself_desc: Yup.string().required("myself_desc is required"),
    myself_avatar: Yup.string().required("myself_avatar is required"),
    myself_fb: Yup.string().required("myself_fb is required"),
    myself_zalo: Yup.string().required("myself_zalo is required"),
    myself_instagram: Yup.string().required("myself_instagram is required"),
    myself_email: Yup.string().required("myself_email is required"),
    myself_fb_name: Yup.string().required("myself_fb_name is required"),
    myself_zalo_name: Yup.string().required("myself_zalo_name is required"),

    home_logo: Yup.string().required("home_logo is required"),
    home_introduce: Yup.string().required("home_introduce is required"),

    meta_title: Yup.string().required("meta_title is required"),
    meta_keywords: Yup.string().required("meta_keywords is required"),
    meta_desc: Yup.string().required("meta_desc is required"),
    meta_author: Yup.string().required("meta_author is required"),
    meta_thumbnail: Yup.string().required("meta_thumbnail is required"),
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
  } = useForm(formOptions);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await handleSubmitForm(data);

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
            name="myself_name"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_name"
                variant="outlined"
                error={errors.myself_name ? true : false}
                helperText={errors.myself_name ? errors.myself_name.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_name}
          />
          <Controller
            name="myself_desc"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_desc"
                variant="outlined"
                error={errors.myself_desc ? true : false}
                helperText={errors.myself_desc ? errors.myself_desc.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_desc}
          />
          <Controller
            name="myself_avatar"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_avatar"
                variant="outlined"
                error={errors.myself_avatar ? true : false}
                helperText={errors.myself_avatar ? errors.myself_avatar.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_avatar}
          />
          <Controller
            name="myself_fb"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_fb"
                variant="outlined"
                error={errors.myself_fb ? true : false}
                helperText={errors.myself_fb ? errors.myself_fb.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_fb}
          />
          <Controller
            name="myself_zalo"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_zalo"
                variant="outlined"
                error={errors.myself_zalo ? true : false}
                helperText={errors.myself_zalo ? errors.myself_zalo.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_zalo}
          />
          <Controller
            name="myself_instagram"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_instagram"
                variant="outlined"
                error={errors.myself_instagram ? true : false}
                helperText={errors.myself_instagram ? errors.myself_instagram.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_instagram}
          />
          <Controller
            name="myself_email"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_email"
                variant="outlined"
                error={errors.myself_email ? true : false}
                helperText={errors.myself_email ? errors.myself_email.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_email}
          />
          <Controller
            name="home_logo"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="home_logo"
                variant="outlined"
                error={errors.home_logo ? true : false}
                helperText={errors.home_logo ? errors.home_logo.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.home_logo}
          />
          <Controller
            name="meta_title"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="meta_title"
                variant="outlined"
                error={errors.meta_title ? true : false}
                helperText={errors.meta_title ? errors.meta_title.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.meta_title}
          />
          <Controller
            name="meta_keywords"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="meta_keywords"
                variant="outlined"
                error={errors.meta_keywords ? true : false}
                helperText={errors.meta_keywords ? errors.meta_keywords.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.meta_keywords}
          />
          <Controller
            name="meta_desc"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="meta_desc"
                variant="outlined"
                error={errors.meta_desc ? true : false}
                helperText={errors.meta_desc ? errors.meta_desc.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.meta_desc}
          />
          <Controller
            name="meta_author"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="meta_author"
                variant="outlined"
                error={errors.meta_author ? true : false}
                helperText={errors.meta_author ? errors.meta_author.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.meta_author}
          />
          <Controller
            name="meta_thumbnail"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="meta_thumbnail"
                variant="outlined"
                error={errors.meta_thumbnail ? true : false}
                helperText={errors.meta_thumbnail ? errors.meta_thumbnail.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.meta_thumbnail}
          />
          <Controller
            name="myself_fb_name"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_fb_name"
                variant="outlined"
                error={errors.myself_fb_name ? true : false}
                helperText={errors.myself_fb_name ? errors.myself_fb_name.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_fb_name}
          />
          <Controller
            name="myself_zalo_name"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <TextField
                size="small"
                fullWidth
                label="myself_zalo_name"
                variant="outlined"
                error={errors.myself_zalo_name ? true : false}
                helperText={errors.myself_zalo_name ? errors.myself_zalo_name.message : ""}
                inputRef={ref}
                {...field}
              />
            )}
            defaultValue={initData.myself_zalo_name}
          />

          <Controller
            name="home_introduce"
            control={control}
            render={({ field: { onChange, value, ref, ...field } }) => (
              <Ckeditor content={value} setContent={onChange} setIsLoadingUploadImage={setIsLoadingUploadImage} />
            )}
            defaultValue={initData.home_introduce}
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
export default SystemForm;
