import { Avatar, Backdrop, Box, Fade, Modal, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosCustom from "../../configs/axios";
import convertTime from "../../utils/convertTime";
import LoadingBox from "../homePage/LoadingBox";
import { getUser } from "../../redux/actions/getUser";
const Info = ({ user, isLoading, account, socket }) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  const [dataUser, setDataUser] = useState(null);

  const avatarInput = useRef(null);
  const [avatarUpload, setAvatarUpload] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isSuccessUpload, setIsSuccessUpload] = useState(false);
  const [isReFetch, setIsReFetch] = useState(false);
  const handleOpen = () => setIsOpenModal(true);
  const handleClose = () => setIsOpenModal(false);

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
    fontSize: "1.6rem",
    cursor: "pointer",

    "&:active": {
      backgroundColor: "#e3e1e1",
    },
    "&:last-child": {
      color: "red",
    },
  });
  useEffect(() => {
    if (user) {
      setDataUser(user);
    }
  }, [user]);
  useEffect(() => {
    if (avatarUpload) {
      handleUploadAvatar();
    }
  }, [avatarUpload]);
  const handleUploadAvatar = async () => {
    try {
      setIsLoadingUpload(true);
      setIsSuccessUpload(false);
      handleClose();
      const uploadCloudinary = await axios({
        method: "post",
        url: `${process.env.ENDPOINT_SERVER}/api/v1/users/upload-avatar`,
        data: avatarUpload,
        headers: {
          "Content-Type": `multipart/form-data;`,
        },
      });
      const res = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/users/update`, {
        avatar: uploadCloudinary.data.data,
      });

      setDataUser(res.data.data);
      dispatch(getUser(user.account));

      setAvatarUpload("");
      setIsLoadingUpload(false);
      setIsSuccessUpload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
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
      handleClose();
      const res = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/users/update`, {
        avatar: "",
      });
      setDataUser(res.data.data);
      dispatch(getUser(user.account));
      setIsLoadingUpload(false);
      setIsSuccessUpload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
      setIsLoadingUpload(false);
    }
  };
  const AvatarPersonal = styled(Avatar)({
    width: "100px",
    height: "100px",
    fontSize: "4rem",
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

          padding: { xs: "40px 10px", md: "40px 20px" },
          gap: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
        }}
      >
        <LoadingBox isLoading={isLoadingUpload} isSuccess={isSuccessUpload} />
        {session && session.user && account === session.user.account && (
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
                {dataUser && dataUser.avatar && (
                  <ModalText onClick={() => hanldeClickRemoveAvatar()}>Remove the current avatar</ModalText>
                )}
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
        )}
        {isLoading && <Skeleton variant="circular" width={150} height={150} />}
        {!isLoading && dataUser && (
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.dialog.bgColor.default,
              borderRadius: "20px",
              padding: "10px",
              height: "150px",
            }}
          >
            <AvatarPersonal
              sx={{
                borderRadius: "10px",
                backgroundColor: (theme) => theme.palette.avatar.default,
              }}
              onClick={handleOpen}
              alt={dataUser.name}
              src={dataUser.avatar}
            >
              {dataUser.name.charAt(0)}
            </AvatarPersonal>
          </Box>
        )}
        <Box
          sx={{
            flex: "1 1",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Noto Sans",
          }}
        >
          {isLoading && (
            <>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={150} height={10} />
              <Skeleton variant="text" width={150} height={10} />
            </>
          )}
          {!isLoading && dataUser && (
            <>
              <Typography
                sx={{
                  fontSize: "3rem",
                  fontWeight: "700",
                }}
              >
                {dataUser.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "500",
                  color: (theme) => theme.palette.iconColor.default,
                }}
              >
                @{dataUser.account}
              </Typography>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  fontSize: "1.4rem",
                  fontWeight: "500",
                }}
              >
                Joined {convertTime(dataUser.createdAt)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
export default Info;
