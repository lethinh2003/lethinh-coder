import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import validator from "validator";
const CodeDownloadModal = ({ isOpenModal, setIsOpenModal, status, sourceCode }) => {
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailField, setEmailField] = useState({
    value: "",
    isError: false,
    messageError: "",
  });
  useEffect(() => {
    if (emailField.value) {
      if (validator.isEmail(emailField.value)) {
        setEmailField((prev) => ({ ...prev, isError: false, messageError: "" }));
      } else {
        setEmailField((prev) => ({ ...prev, isError: true, messageError: "Email không hợp lệ" }));
      }
    }
  }, [emailField.value]);

  const handleClose = () => {
    setIsOpenModal(false);
    setEmailField((prev) => ({
      ...prev,
      value: "",
      isError: false,
      messageError: "",
    }));
  };

  const handleChangeEmail = (event) => {
    setEmailField((prev) => ({
      ...prev,
      value: event.target.value,
    }));
  };

  const handleClickSubmit = async (code) => {
    if (!validator.isEmail(emailField.value)) {
      setEmailField((prev) => ({ ...prev, isError: true, messageError: "Email không hợp lệ" }));
      inputRef?.current?.focus();
      return;
    }
    try {
      setIsLoading(true);
      const result = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/codes/download`, {
        email: emailField.value,
        codeId: sourceCode._id,
      });
      toast.success(result.data.message);
      handleClose();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <>
      {status !== "authenticated" && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Dialog open={isOpenModal} onClose={handleClose}>
            <DialogTitle>Download Code</DialogTitle>
            <DialogContent>
              <DialogContentText>Nhập email xong vui lòng kiểm tra trong hòm thư rác, spam!</DialogContentText>
              {emailField.isError && (
                <DialogContentText sx={{ color: "#f44336" }}>ERROR: {emailField.messageError}</DialogContentText>
              )}
              <TextField
                inputRef={inputRef}
                sx={{ marginBottom: "20px" }}
                error={emailField.isError}
                helperText={emailField.messageError}
                autoFocus
                margin="dense"
                id="email"
                value={emailField.value}
                onChange={(e) => handleChangeEmail(e)}
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClickSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};
export default CodeDownloadModal;
