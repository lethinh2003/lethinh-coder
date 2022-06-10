import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Skeleton,
  TextareaAutosize,
  Box,
  Card,
  CardMedia,
  ImageListItem,
  ImageList,
  Checkbox,
  Typography,
} from "@mui/material";
const keyword_extractor = require("keyword-extractor");
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import convertTime from "../../../utils/convertTime";
import validator from "validator";
import * as Yup from "yup";
import axios from "axios";
const Modal = (props) => {
  // form validation rules
  const validationSchema = Yup.object().shape({});
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const { isModal, setIsModal, title, id, setId } = props;
  const [data, setData] = useState([]);
  const [dataImg, setDataImg] = useState([]);
  const [dataLabel, setDataLabel] = useState([]);
  const [dataContent, setDataContent] = useState("");
  const [dataImgAdd, setDataImgAdd] = useState("");
  const [dataLabelAdd, setDataLabelAdd] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //form

  const [dataStatus, setDataStatus] = useState(true);

  //end form
  const handleClose = () => {
    setIsModal(false);
    setId("");
  };
  const handleChange = (event) => {
    setDataStatus(event.target.checked);
  };
  useEffect(() => {
    const getDetailCode = async () => {
      try {
        const result = await axios.get("/api/admin/source-code/" + id);
        setData(result.data.data);
        if (result.data.data.length > 0) {
          setDataLabel(result.data.data[0].labels);
          setDataImg(result.data.data[0].images);
          setDataContent(result.data.data[0].content);

          setDataStatus(result.data.data[0].status);
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    getDetailCode();
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("../../../ckeditor5-build-with-htmlembed-master"),
    };
    setEditorLoaded(true);
  }, [id]);
  const handleClickDeleteImg = (id) => {
    const newData = dataImg.filter((item) => item != id);
    setDataImg(newData);
  };
  const handleChangeImgAdd = (e) => {
    setDataImgAdd(e.target.value);
  };
  const handleChangeLabelAdd = (e) => {
    setDataLabelAdd(e.target.value);
  };

  const handleClickAddImg = () => {
    if (validator.isURL(dataImgAdd)) {
      const newData = dataImg;
      newData.push(dataImgAdd);
      setDataImg(newData);
      setDataImgAdd("");
    }
  };
  const handleClickAddLabel = () => {
    if (dataLabelAdd.length > 0) {
      const newData = dataLabel;
      newData.push(dataLabelAdd.toLowerCase());
      setDataLabel(newData);
      setDataLabelAdd("");
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/admin/source-code/" + id, {
        id: id,
        title: data.title,
        content: dataContent,
        link: data.link,
        costs: data.costs,
        images: dataImg,
        desc: data.desc,
        status: dataStatus,
        labels: dataLabel,
        keywords: data.keywords.split(", "),
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };
  const handleClickDeleteLabel = (data) => {
    const newData = dataLabel.filter((item) => item !== data);
    setDataLabel(newData);
  };
  const LabelInput = styled(Typography)({
    fontWeight: "500",
    opacity: "0.7",
  });
  return (
    <>
      <Dialog
        open={isModal}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(3px)",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {isLoading && (
            <>
              <Skeleton variant="rectangular" height={50} sx={{ marginTop: "10px" }} width={300} />
              <Skeleton variant="rectangular" height={50} sx={{ marginTop: "10px" }} width={300} />
              <Skeleton variant="rectangular" height={150} sx={{ marginTop: "10px" }} width={300} />
            </>
          )}
          {!isLoading && data.length > 0 && (
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
                <DialogContentText sx={{ pt: 2 }}>
                  <LabelInput>Title</LabelInput>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        error={errors.title ? true : false}
                        helperText={errors.title ? errors.title.message : ""}
                        {...field}
                      />
                    )}
                    defaultValue={data[0].title}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <LabelInput>Desc</LabelInput>
                  <Controller
                    name="desc"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        error={errors.desc ? true : false}
                        helperText={errors.desc ? errors.desc.message : ""}
                        {...field}
                      />
                    )}
                    defaultValue={data[0].desc}
                  />
                </DialogContentText>
                {!editorLoaded && <div>Editor loading</div>}
                {editorLoaded && (
                  <Box sx={{ width: "100%", color: "black", pt: 2, fontSize: "2rem" }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={dataContent}
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setDataContent(data);
                      }}
                    />
                  </Box>
                )}
                <DialogContentText sx={{ pt: 2 }}>
                  <LabelInput>Link</LabelInput>
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        error={errors.link ? true : false}
                        helperText={errors.link ? errors.link.message : ""}
                        {...field}
                      />
                    )}
                    defaultValue={data[0].link}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <LabelInput>Costs</LabelInput>
                  <Controller
                    name="costs"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        type="number"
                        fullWidth
                        error={errors.costs ? true : false}
                        helperText={errors.costs ? errors.costs.message : ""}
                        {...field}
                      />
                    )}
                    defaultValue={data[0].costs}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <TextField fullWidth label="Thời gian" defaultValue={convertTime(data[0].createdAt)} disabled />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <TextField fullWidth label="Cập nhật" defaultValue={convertTime(data[0].updatedAt)} disabled />
                </DialogContentText>
                <ImageList sx={{ width: "100%", height: 450 }} cols={3}>
                  {dataImg.length > 0 &&
                    dataImg.map((item) => (
                      <ImageListItem
                        key={item}
                        sx={{
                          marginTop: "20px",
                        }}
                      >
                        <img
                          src={item}
                          style={{
                            width: "170px",
                            heigth: "170px",
                          }}
                          loading="lazy"
                        />
                        <IconButton
                          onClick={() => handleClickDeleteImg(item)}
                          sx={{
                            width: "50px",
                            minHeight: "50px",

                            alignSelf: "center",
                          }}
                          aria-label="Cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      </ImageListItem>
                    ))}
                </ImageList>
                <DialogContentText sx={{ pt: 2 }}>
                  <TextField
                    fullWidth
                    label="Thêm ảnh"
                    defaultValue={dataImgAdd}
                    value={dataImgAdd}
                    onChange={(e) => handleChangeImgAdd(e)}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <Button variant="outlined" onClick={handleClickAddImg} disabled={!validator.isURL(dataImgAdd)}>
                    Thêm
                  </Button>
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <LabelInput>Keywords</LabelInput>
                  <Controller
                    name="keywords"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        fullWidth
                        error={errors.keywords ? true : false}
                        helperText={errors.keywords ? errors.keywords.message : ""}
                        {...field}
                      />
                    )}
                    defaultValue={data[0].keywords.join(", ")}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  Labels
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5px",
                      flexWrap: "wrap",
                    }}
                  >
                    {dataLabel &&
                      dataLabel.map((item, i) => (
                        <Button key={i} variant="outlined" onClick={() => handleClickDeleteLabel(item)}>
                          {item}
                        </Button>
                      ))}
                  </Box>
                </DialogContentText>

                <DialogContentText sx={{ pt: 2 }}>
                  <TextField
                    fullWidth
                    label="Thêm label"
                    defaultValue={dataLabelAdd}
                    value={dataLabelAdd}
                    onChange={(e) => handleChangeLabelAdd(e)}
                  />
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  <Button variant="outlined" onClick={handleClickAddLabel} disabled={!(dataLabelAdd.length > 0)}>
                    Thêm
                  </Button>
                </DialogContentText>
                <DialogContentText sx={{ pt: 2 }}>
                  Hiển thị
                  <Checkbox checked={dataStatus} defaultChecked={data[0].status} onChange={handleChange} />{" "}
                </DialogContentText>

                <DialogContentText sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
                  <Button variant="outlined" type="submit" onClick={handleSubmit(onSubmit)}>
                    Chỉnh sửa
                  </Button>
                </DialogContentText>
              </form>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Modal;
