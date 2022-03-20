import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Skeleton,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import { styled } from "@mui/material/styles";
import LoadingBox from "../homePage/LoadingBox";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getAvatar } from "../../redux/actions";

const Info = (props) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  const avatarInput = useRef(null);
  const [avatarUpload, setAvatarUpload] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isSuccessUpload, setIsSuccessUpload] = useState(false);
  const [isReFetch, setIsReFetch] = useState(false);
  const handleOpen = () => setIsOpenModal(true);
  const handleClose = () => setIsOpenModal(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const result = await axios.get("/api/users?account=" + session.user.account);
        setIsLoading(false);
        setData(result.data.data[0].userInfo);
      } catch (err) {
        console.log(err);
      }
    };
    if (session && session.user) {
      getUser();
    }
  }, [status, isReFetch]);
  const StyleModal = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "#fff",
    boxShadow: 24,
    borderRadius: "20px",
    padding: "0",
    overflow: "hidden",

    "&:focus-visible": {
      outlined: "unset",
      border: "unset",
    },
  });
  const ModalText = styled(Typography)({
    borderBottom: "1px solid #9f8989",
    textAlign: "center",
    padding: "8px 0",
    fontFamily: "Noto Sans",
    fontSize: "16px",
    cursor: "pointer",

    "&:active": {
      backgroundColor: "#e3e1e1",
    },
    "&:last-child": {
      color: "red",
    },
  });
  useEffect(() => {
    if (avatarUpload) {
      handleUploadAvatar();
    }
  }, [avatarUpload]);
  const handleUploadAvatar = async () => {
    try {
      setIsLoadingUpload(true);
      setIsSuccessUpload(false);
      setIsReFetch(false);
      handleClose();
      const uploadCloudinary = await axios({
        method: "post",
        url: `${process.env.HOST_SOCKET}/api/v1/users/upload-avatar`,
        data: avatarUpload,
        headers: {
          "Content-Type": `multipart/form-data;`,
        },
      });
      await axios.post(`${process.env.HOST_SOCKET}/api/v1/users/update`, {
        avatar: uploadCloudinary.data.data,
        name: session.user.name,
      });

      dispatch(getAvatar(uploadCloudinary.data.data));
      setAvatarUpload("");
      setIsLoadingUpload(false);
      setIsSuccessUpload(true);
      setIsReFetch(true);
    } catch (err) {
      console.log(err);
      setAvatarUpload("");
      setIsLoadingUpload(false);
    }
  };

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("file", e.target.files[0], "file");
    setAvatarUpload(uploadData);
  };
  const hanldeClickRemoveAvatar = async () => {
    try {
      setIsLoadingUpload(true);
      setIsSuccessUpload(false);
      setIsReFetch(false);
      handleClose();
      await axios.post(`${process.env.HOST_SOCKET}/api/v1/users/update`, {
        avatar: "",
        name: session.user.name,
      });
      dispatch(getAvatar("empty"));
      setIsLoadingUpload(false);
      setIsSuccessUpload(true);
      setIsReFetch(true);
    } catch (err) {
      console.log(err);
      setIsLoadingUpload(false);
    }
  };
  const AvatarPersonal = styled(Avatar)({
    width: "150px",
    height: "150px",
    fontSize: "40px",
    position: "relative",

    "&::before": {
      content: `""`,
      position: "absolute",
    },
  });
  return (
    <>
      <Box
        sx={{
          minHeight: "340px",
          width: "100%",
          borderRadius: "20px",
          padding: "20px",
          gap: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
        }}
      >
        <LoadingBox isLoading={isLoadingUpload} isSuccess={isSuccessUpload} />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isOpenModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isOpenModal}>
            <StyleModal>
              <ModalText>
                <div className="input-file" style={{ display: "none" }}>
                  <input type="file" name="file" ref={avatarInput} id="file" onChange={(e) => handleFileUpload(e)} />
                </div>
                <label
                  style={{
                    width: "100%",
                    display: "inline-block",
                  }}
                  htmlFor="file"
                  className="input-label"
                >
                  Add the avatar
                </label>
              </ModalText>
              <ModalText onClick={() => hanldeClickRemoveAvatar()}>Remove the current avatar</ModalText>
              <Typography
                sx={{
                  textAlign: "center",
                }}
              >
                <ModalText onClick={handleClose}>Cancel</ModalText>
              </Typography>
            </StyleModal>
          </Fade>
        </Modal>
        {isLoading && <Skeleton variant="circular" width={150} height={150} />}
        {!isLoading && data.length > 0 && (
          <AvatarPersonal onClick={handleOpen} alt={data[0].name} src={data[0].avatar}>
            {data[0].name.charAt(0)}
          </AvatarPersonal>
        )}
        <Box
          sx={{
            flex: "1 1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isLoading && (
            <>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={150} />
            </>
          )}
          {!isLoading && data.length > 0 && (
            <>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                Profile
              </Typography>
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                {data[0].name}
              </Typography>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                Tham gia: {convertTime(data[0].createdAt)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
export default Info;
