import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { KEY_GET_LIST_CODE } from "../../../configs/keyUseQuery";
import CodeService from "../../../services/client/admin/CodeService";
const Modal = (props) => {
  const queryClient = useQueryClient();
  const { isModal, setIsModal, dataDelete, setDataDelete } = props;
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
      const results = await CodeService.deleteCode({ codeId: dataDelete.id });
      queryClient.invalidateQueries({
        queryKey: KEY_GET_LIST_CODE,
        refetchInactive: true,
      });
      setIsLoading(false);
      toast.success(results.data.message);

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
