import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Avatar,
  Card,
  CardActions,
  CardContent,
  TextField,
  CardMedia,
  Input,
  Backdrop,
  CircularProgress,
  Alert,
  AlertTitle,
  Fade,
  Snackbar,
} from "@mui/material";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { styled } from "@mui/material/styles";
import { Bars } from "react-loading-icons";
import { BsCheckSquare } from "react-icons/bs";
const LoadingBox = (props) => {
  const { isSuccess, isLoading } = props;
  const BoxLoading = styled(Box)({
    borderRadius: "20px",
    backgroundColor: "#fff",
    color: "black",
    width: "200px",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  });
  const LoadingContent = styled(Typography)({
    fontWeight: "500",
    opacity: "0.7",
  });
  const LoadingIconSuccess = styled(BsCheckSquare)({
    fontSize: "50px",
    color: "#41bf90",
  });
  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <BoxLoading>
          {!isSuccess && (
            <>
              <Bars fill="#06bcee" width={50} height={50} speed={0.75} />
              <LoadingContent>Loading...</LoadingContent>
            </>
          )}
          {isSuccess && (
            <>
              <LoadingIconSuccess />
              <LoadingContent>Success</LoadingContent>
            </>
          )}
        </BoxLoading>
      </Backdrop>
    </>
  );
};
export default LoadingBox;
