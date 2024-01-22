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
import { KEY_GET_LIST_BLOG } from "../../../configs/keyUseQuery";
import BlogService from "../../../services/client/admin/BlogService";
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
        toast.error("Vui lòng nhập đúng tên blog");
      }
      setIsLoading(true);
      const results = await BlogService.deleteBlog({ blogId: dataDelete.id });
      queryClient.invalidateQueries({
        queryKey: KEY_GET_LIST_BLOG,
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
            <DialogTitle>Xóa Blog {dataDelete.title}</DialogTitle>
            <DialogContent>
              {isLoading && <Skeleton variant="rectangular" height={200} width={300} />}
              {!isLoading && (
                <>
                  <DialogContentText sx={{ pt: 2 }}>Xác nhận xoá {dataDelete.title}</DialogContentText>
                  <DialogContentText sx={{ pt: 2 }}>
                    Vui lòng nhập đúng tên blog để xoá:{" "}
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
