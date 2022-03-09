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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

import validator from "validator";
import axios from "axios";
import Modal from "../homePage/Modal";
const Email = (props) => {
  const { isEmailModal, setIsEmailModal, status, codeId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState("");
  const handleClose = () => {
    setIsEmailModal(false);
    setEmailValue("");
    setIsError(false);
  };

  const handleChange = (type, e) => {
    if (type === "email") {
      setEmailValue(e.target.value);
    }
  };

  const handleClickSubmit = async (code) => {
    if (validator.isEmail(emailValue)) {
      try {
        setIsLoading(true);

        const result = await axios.post("/api/source-code/email", {
          email: emailValue,
          codeId: codeId,
        });
        setIsModal(true);
        setText(result.data.message);

        handleClose();
        setIsError(false);

        setIsLoading(false);
      } catch (err) {
        if (err.response) {
          setMessageError(err.response.data.message);
        }
        setIsLoading(false);

        setIsError(true);
      }
    }
  };
  return (
    <>
      {status !== "authenticated" && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Modal title={"Thông báo"} isModal={isModal} setIsModal={setIsModal}>
            <DialogContentText>{text}</DialogContentText>
          </Modal>
          <Dialog open={isEmailModal} onClose={handleClose}>
            <DialogTitle>Download Code</DialogTitle>
            <DialogContent>
              <DialogContentText>Nhập email xong vui lòng kiểm tra trong hòm thư rác, spam!</DialogContentText>
              {isError && <DialogContentText sx={{ color: "#f44336" }}>ERROR: {messageError}</DialogContentText>}
              <TextField
                sx={{ marginBottom: "20px" }}
                error={validator.isEmail(emailValue) ? false : true}
                helperText={validator.isEmail(emailValue) ? "" : "Vui lòng nhập địa chỉ email hợp lệ"}
                autoFocus
                margin="dense"
                id="email"
                value={emailValue}
                onChange={(e) => handleChange("email", e)}
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
              />
              <DialogContentText>
                Lưu ý: <br />- Code miễn phí thì chỉ cần nhập mail, sau đó check mail.
                <br />- Code có phí thì bạn phải thanh toán trước sau đó mới nhập mail, đội ngũ BQT sẽ gửi mail cho bạn
                sau khi check thành công
              </DialogContentText>
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
export default Email;
