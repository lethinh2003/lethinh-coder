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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import convertTime from "../../../utils/convertTime";
import validator from "validator";

import axios from "axios";
const Modal = (props) => {
  const { isModal, setIsModal, title, id, setId } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataTitle, setDataTitle] = useState("");

  //end form
  const handleClose = () => {
    setIsModal(false);
    setId("");
  };

  useEffect(() => {
    const getDetailCode = async () => {
      try {
        const result = await axios.get("/api/admin/source-code/" + id);
        setData(result.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    getDetailCode();
  }, [id]);
  const handleClickDelete = async () => {
    try {
      if (dataTitle !== data[0].title) {
        throw new Error("Vui lòng nhập đúng tên code");
      }
      setIsLoading(true);
      const response = await axios.delete("/api/admin/source-code/" + id);
      console.log(response);
      setIsLoading(false);
      handleClose();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };
  const handleChangeTitle = (e) => {
    setDataTitle(e.target.value);
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
          {isLoading && <Skeleton variant="rectangular" height={200} width={300} />}
          {!isLoading && data.length > 0 && (
            <>
              <DialogContentText sx={{ pt: 2 }}>Xác nhận xoá {data[0].title}</DialogContentText>
              <DialogContentText sx={{ pt: 2 }}>
                Vui lòng nhập đúng tên code để xoá:{" "}
                <Typography sx={{ color: "#c97878", fontWeight: "bold" }}>{data[0].title}</Typography>
              </DialogContentText>
              <DialogContentText sx={{ pt: 2 }}>
                <TextField fullWidth onChange={(e) => handleChangeTitle(e)} value={dataTitle} label="Title" />
              </DialogContentText>
              <DialogContentText sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
                <Button disabled={dataTitle !== data[0].title} variant="outlined" onClick={handleClickDelete}>
                  Xác nhận
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
