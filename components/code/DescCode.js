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
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Input,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AiFillFileZip, AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";
import { SiZalo } from "react-icons/si";
import InstagramIcon from "@mui/icons-material/Instagram";
import CancelIcon from "@mui/icons-material/Cancel";
import NumberFormat from "react-number-format";
import Email from "../auth/Email";
import Lightbox from "react-image-lightbox";

const DescCode = (props) => {
  const { sourceCode, status } = props;
  const [isEmailModal, setIsEmailModal] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);
  const handleClickOpenEmail = () => {
    setIsEmailModal(true);
  };
  const handleClickOpenLightBoxImage = (index) => {
    setPhotoIndex(index);
    setIsOpenLightBox(true);
  };
  const imagesLightBox = sourceCode.length > 0 ? sourceCode[0].images : [];

  return (
    <>
      <h1 className="title">Desciption code</h1>

      {sourceCode.length > 0 &&
        sourceCode.map((item, i) => {
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                bgcolor: "background.default",
                justifyContent: "center",
                color: "text.primary",
                gap: "10px",
                padding: { xs: "10px", md: "20px" },
              }}
            >
              <Email isEmailModal={isEmailModal} setIsEmailModal={setIsEmailModal} codeId={sourceCode[0]._id} />
              {isOpenLightBox && imagesLightBox.length > 0 && (
                <Lightbox
                  mainSrc={imagesLightBox[photoIndex]}
                  nextSrc={imagesLightBox[(photoIndex + 1) % imagesLightBox.length]}
                  prevSrc={imagesLightBox[(photoIndex + imagesLightBox.length - 1) % imagesLightBox.length]}
                  onCloseRequest={() => setIsOpenLightBox(false)}
                  onMovePrevRequest={() =>
                    setPhotoIndex((photoIndex + imagesLightBox.length - 1) % imagesLightBox.length)
                  }
                  onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imagesLightBox.length)}
                />
              )}
              <h1 style={{ fontFamily: "Noto Sans" }}>{item.title}</h1>
              {item.updatedAt && (
                <Typography
                  sx={{
                    fontWeight: "500",
                  }}
                >
                  <AiOutlineCalendar /> Cập nhật: {convertTime(sourceCode[0].updatedAt)}{" "}
                </Typography>
              )}
              <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
                <div className="content-html" dangerouslySetInnerHTML={{ __html: item.content }} />
              </Typography>

              <Typography
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {status === "authenticated" ? (
                  <Button variant="outlined" onClick={() => handleClickOpenEmail()}>
                    Download Code
                  </Button>
                ) : (
                  <Button variant="outlined">Đăng Nhập Để Download Code</Button>
                )}

                <h1 className="title">Images</h1>

                {item.images.length > 0 &&
                  item.images.map((im, i) => {
                    return (
                      <img
                        loading="lazy"
                        onClick={() => handleClickOpenLightBoxImage(i)}
                        alt={item.title}
                        key={i}
                        src={im}
                        style={{
                          maxWidth: "600px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    );
                  })}
              </Typography>
            </Box>
          );
        })}
    </>
  );
};
export default DescCode;
