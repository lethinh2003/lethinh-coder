import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Tab, Tabs, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import socketIOClient from "socket.io-client";
import Activities from "./Activities";
import Notifies from "./Notifies";

let socket;
const Info = (props) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [value, setValue] = useState("0");

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
  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, [status]);
  const socketInitializer = () => {
    socket = socketIOClient.connect(process.env.HOST_SOCKET);
  };

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
      const data = {
        idRoom: session.user.id,
        dataImage: uploadCloudinary.data.data,
      };
      socket.emit("update-avatar-profile", data);
      localStorage.setItem("avatarProfile", uploadCloudinary.data.data);

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
      const data = {
        idRoom: session.user.id,
        dataImage: "",
      };
      socket.emit("update-avatar-profile", data);

      localStorage.removeItem("avatarProfile");
      setIsLoadingUpload(false);
      setIsSuccessUpload(true);
      setIsReFetch(true);
    } catch (err) {
      console.log(err);
      setIsLoadingUpload(false);
    }
  };
  const AvatarPersonal = styled(Avatar)({
    width: "100px",
    height: "100px",
    fontSize: "40px",
    position: "relative",

    "&::before": {
      content: `""`,
      position: "absolute",
    },
  });

  const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    "& .MuiTabs-indicator": {
      backgroundColor: "#1890ff",
    },
  });

  const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    marginRight: theme.spacing(1),
    color: "rgba(0, 0, 0, 0.85)",

    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#1890ff",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  }));
  const styledTabs = styled(Tabs)({
    ".MuiTabs-root": {
      backgroundColor: "red",
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: "none",
    fontWeight: "600",
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: theme.palette.iconColor.default,
    "&.Mui-selected": {
      color: theme.palette.mode === "dark" ? "#fff" : "black",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#20262d" : "#eaebec",
      borderRadius: "20px",
    },
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: { xs: "0 10px", md: "0 20px" },
          gap: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", md: "column" },
          flexWrap: "wrap",
          borderBottom: (theme) => (theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e"),
        }}
      >
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            sx={{
              width: "100%",

              borderBottom: (theme) => (theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e"),
            }}
          >
            <StyledTab label="Activity" value="0" />
            <StyledTab label="Notification" value="1" />
          </TabList>

          <TabPanel
            sx={{
              padding: 0,
              width: "100%",
            }}
            value="0"
          >
            <Activities />
          </TabPanel>
          <TabPanel
            sx={{
              padding: 0,
              width: "100%",
            }}
            value="1"
          >
            <Notifies />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};
export default Info;
