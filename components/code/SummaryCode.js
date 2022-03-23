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

const SummaryCode = (props) => {
  const { sourceCode, status } = props;
  const [listContents, setListContents] = useState([]);
  const [isContentPos, setIsContentPos] = useState("");
  useEffect(() => {
    const data = [];
    const getH1elements = document.querySelectorAll(".content-html h1");
    if (getH1elements.length > 0) {
      for (let i = 0; i < getH1elements.length; i++) {
        data.push(getH1elements[i]);
      }
    }
    setListContents(data);
  }, [sourceCode]);
  useEffect(() => {
    const eventScroll = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c <= listContents[0].offsetTop - 150) {
        setIsContentPos("");
      } else {
        if (listContents.length > 0) {
          listContents.map((item) => {
            if (c >= item.offsetTop - item.offsetHeight) {
              setIsContentPos(item.innerText);
            }
          });
        }
      }
    };
    document.addEventListener("scroll", eventScroll);
    return () => {
      document.removeEventListener("scroll", eventScroll);
    };
  }, [listContents]);

  const handleClickContent = (item) => {
    window.scrollTo(0, item.offsetTop - item.offsetHeight);
  };

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
          padding: "40px 0",
          position: "-webkit-sticky",
          position: "sticky",
          top: 5,
        }}
      >
        <h1 className="title">Contents</h1>
        <Box
          className="tableofcontents"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "10px", md: "20px" },
            minWidth: "300px",
            borderLeft: "1px solid #ccc",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {listContents.length > 0 &&
            listContents.map((item, i) => (
              <Typography
                className={item.innerText === isContentPos ? "table_content active" : "table_content"}
                onClick={() => handleClickContent(item)}
                key={i}
              >
                {item.innerText}
              </Typography>
            ))}
        </Box>
      </Box>
    </>
  );
};
export default SummaryCode;
