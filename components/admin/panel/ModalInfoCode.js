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
} from "@mui/material";
const keyword_extractor = require("keyword-extractor");

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import convertTime from "../../../utils/convertTime";
import validator from "validator";

import axios from "axios";
const Modal = (props) => {
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
  const [dataTitle, setDataTitle] = useState("");
  const [dataDesc, setDataDesc] = useState("");
  const [dataLink, setDataLink] = useState("");
  const [dataCosts, setDataCosts] = useState(0);
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
          setDataTitle(result.data.data[0].title);
          setDataDesc(result.data.data[0].desc);
          setDataLink(result.data.data[0].link);
          setDataCosts(result.data.data[0].costs);
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
  const handleChangeTitle = (e) => {
    setDataTitle(e.target.value);
  };
  const handleChangeDesc = (e) => {
    setDataDesc(e.target.value);
  };
  const handleChangeLink = (e) => {
    setDataLink(e.target.value);
  };
  const handleChangeCosts = (e) => {
    setDataCosts(e.target.value);
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
  const handleClickEdit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/admin/source-code/" + id, {
        id: id,
        title: dataTitle,
        content: dataContent,
        link: dataLink,
        costs: dataCosts,
        images: dataImg,
        desc: dataDesc,
        status: dataStatus,
        labels: dataLabel,
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
              <DialogContentText sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  defaultValue={data[0].title}
                  onChange={(e) => handleChangeTitle(e)}
                  value={dataTitle}
                  label="Title"
                />
              </DialogContentText>
              <DialogContentText sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  onChange={(e) => handleChangeDesc(e)}
                  value={dataDesc}
                  label="Desc"
                  defaultValue={data[0].desc}
                />
              </DialogContentText>
              {!editorLoaded && <div>Editor loading</div>}
              {editorLoaded && (
                <Box sx={{ width: "100%", color: "black", pt: 2 }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={dataContent}
                    onReady={(editor) => {
                      // You can store the "editor" and use when it is needed.
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDataContent(data);
                    }}
                  />
                </Box>
              )}
              <DialogContentText sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  onChange={(e) => handleChangeLink(e)}
                  value={dataLink}
                  label="Link"
                  defaultValue={data[0].link}
                />
              </DialogContentText>
              <DialogContentText sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  onChange={(e) => handleChangeCosts(e)}
                  value={dataCosts}
                  label="Giá"
                  type="number"
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
                <Button variant="outlined" onClick={handleClickEdit}>
                  Chỉnh sửa
                </Button>
              </DialogContentText>
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
