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

import axios from "axios";

const Signup = (props) => {
  const { isSignupModal, setIsSignupModal, status } = props;
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [accountValue, setAccountValue] = useState("");
  const [messageError, setMessageError] = useState("");
  const handleClose = () => {
    setIsSignupModal(false);
  };
  const handleChange = (type, e) => {
    if (type === "password") {
      setPasswordValue(e.target.value);
    } else if (type === "account") {
      setAccountValue(e.target.value);
    } else if (type === "confirmPassword") {
      setConfirmPasswordValue(e.target.value);
    }
  };
  const handleClickShowPassword = () => {
    setIsShowPassword(true);
  };
  const handleMouseDownPassword = () => {
    setIsShowPassword(false);
  };
  const handleClickShowConfirmPassword = () => {
    setIsShowConfirmPassword(true);
  };
  const handleMouseDownConfirmPassword = () => {
    setIsShowConfirmPassword(false);
  };
  const handleClickSubmit = async () => {
    if (
      passwordValue.length >= 6 &&
      accountValue.length >= 6 &&
      confirmPasswordValue.length >= 6 &&
      confirmPasswordValue === passwordValue
    ) {
      try {
        setIsLoading(true);
        const result = await axios.post("/api/auth/signup", {
          account: accountValue,
          password: passwordValue,
          confirmPassword: confirmPasswordValue,
        });
        setIsError(false);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        if (err.response) {
          setMessageError(err.response.data.message);
        }
        setIsLoading(false);
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
          <Dialog open={isSignupModal} onClose={handleClose}>
            <DialogTitle>Signup</DialogTitle>
            <DialogContent>
              <DialogContentText>Đăng ký tham gia</DialogContentText>
              {isError && <DialogContentText sx={{ color: "#f44336" }}>{messageError}</DialogContentText>}
              <TextField
                sx={{ marginBottom: "20px" }}
                error={accountValue.length >= 6 ? false : true}
                helperText={accountValue.length >= 6 ? "" : "Tài khoản phải từ 6 kí tự trở lên"}
                autoFocus
                margin="dense"
                id="account"
                value={accountValue}
                onChange={(e) => handleChange("account", e)}
                label="Tài khoản"
                type="text"
                fullWidth
                variant="outlined"
              />

              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                <OutlinedInput
                  error={passwordValue.length >= 6 ? false : true}
                  id="outlined-adornment-password"
                  type={isShowPassword ? "text" : "password"}
                  value={passwordValue}
                  onChange={(e) => handleChange("password", e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="confirm-password">Nhập lại mật khẩu</InputLabel>
                <OutlinedInput
                  error={confirmPasswordValue.length >= 6 && confirmPasswordValue === passwordValue ? false : true}
                  id="confirm-password"
                  type={isShowConfirmPassword ? "text" : "password"}
                  value={confirmPasswordValue}
                  onChange={(e) => handleChange("confirmPassword", e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
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
export default Signup;
