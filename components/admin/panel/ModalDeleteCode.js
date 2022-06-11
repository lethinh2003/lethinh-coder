import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
const keyword_extractor = require("keyword-extractor");
import { toast } from "react-toastify";
import axios from "axios";
const Modal = (props) => {
  const { isModal, setIsModal, dataDelete, setDataDelete, setIDDelete } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [dataTitle, setDataTitle] = useState("");

  //end form
  const handleClose = () => {
    setIsModal(false);
    setDataDelete(null);
  };

  const handleClickDelete = async () => {
    try {
      if (dataTitle !== dataDelete.title) {
        toast.error("Vui lòng nhập đúng tên code");
      }
      setIsLoading(true);
      const results = await axios.delete(
        `${process.env.ENDPOINT_SERVER}/api/v1/admin/source-codes/detail/${dataDelete.id}`
      );
      setIsLoading(false);
      toast.success(results.data.message);
      setIDDelete(dataDelete.id);
      handleClose();
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      }
      setIsLoading(false);
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
        {dataDelete && (
          <>
            <DialogTitle>Xóa code {dataDelete.title}</DialogTitle>
            <DialogContent>
              {isLoading && <Skeleton variant="rectangular" height={200} width={300} />}
              {!isLoading && (
                <>
                  <DialogContentText sx={{ pt: 2 }}>Xác nhận xoá {dataDelete.title}</DialogContentText>
                  <DialogContentText sx={{ pt: 2 }}>
                    Vui lòng nhập đúng tên code để xoá:{" "}
                    <Typography sx={{ color: "#c97878", fontWeight: "bold" }}>{dataDelete.title}</Typography>
                  </DialogContentText>
                  <DialogContentText sx={{ pt: 2 }}>
                    <TextField fullWidth onChange={(e) => handleChangeTitle(e)} value={dataTitle} label="Title" />
                  </DialogContentText>
                  <DialogContentText sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
                    <Button disabled={dataTitle !== dataDelete.title} onClick={handleClickDelete}>
                      Xác nhận
                    </Button>
                  </DialogContentText>
                </>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};
export default Modal;
