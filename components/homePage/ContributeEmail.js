import CheckIcon from "@mui/icons-material/Check";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import SocketContext from "../../context/socket";
import { useContext } from "react";
import { memo } from "react";
const Introduce = (props) => {
  const socket = useContext(SocketContext);
  const timeOutAlert = useRef();
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (socket) {
      socketInitializer();
      console.log("socket tao", socket);
    }
    return () => {
      if (socket) {
        socket.off("send-event-homepage-express");
        console.log("socket huy", socket);
      }
      clearTimeout(timeOutAlert.current);
    };
  }, [socket]);

  const socketInitializer = () => {
    socket.emit("join-homepage-express");
    socket.emit("send-event-homepage-express", 0);
    socket.on("send-event-homepage-express", (data) => {
      setData(data);
      setIsSuccess(true);
      clearTimeout(timeOutAlert.current);
      timeOutAlert.current = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
  };
  const IntroduceButton = styled(Button)({
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "10px",
    textTransform: "capitalize",
    fontFamily: "Noto Sans",
    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",

    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const IntroduceTitle = styled(Typography)({
    fontWeight: "bold",

    fontFamily: "Noto Sans",
    color: "#272fec",
  });
  const IntroduceDesc = styled(Typography)({
    fontSize: "20px",
    fontFamily: "Noto Sans",
    color: "#0c1842",
  });
  const IconExpress1 = styled(ThumbUpOffAltIcon)({
    color: "#745544",
    transition: "all 0.2s linear",
    "&:hover": {
      color: "#0043ff",
      transform: "scale(1.3)",
    },
  });
  const IconExpress2 = styled(InsertEmoticonIcon)({
    color: "#745544",
    transition: "all 0.2s linear",
    "&:hover": {
      color: "#fbff00",
      transform: "scale(1.3)",
    },
  });
  const IconExpress3 = styled(SentimentSatisfiedIcon)({
    color: "#745544",
    transition: "all 0.2s linear",
    "&:hover": {
      color: "#c000ff",
      transform: "scale(1.3)",
    },
  });
  const IconExpress4 = styled(SentimentVeryDissatisfiedIcon)({
    color: "#745544",
    transition: "all 0.2s linear",
    "&:hover": {
      color: "#f70d0d",
      transform: "scale(1.3)",
    },
  });
  const AlertExpress = styled(Alert)({
    fontFamily: "Noto Sans",
    top: "7px",
    position: "absolute",
    opacity: 1,
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "10px",
  });
  const handleClickExpress = (id) => {
    socket.emit("send-event-homepage-express", id);
    setIsLoading(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "700px",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              backgroundImage: "linear-gradient(120deg,#fcce9a,#ff9e8d)",
              minHeight: 300,
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              boxShadow: "2px 3px 8px 0px #fea38e",
              border: "2px solid #fff",
              position: "relative",
            }}
          >
            <Box>
              {isLoading && (
                <Fade in={isSuccess}>
                  <AlertExpress icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Cảm ơn bạn đã đánh giá
                  </AlertExpress>
                </Fade>
              )}
              <CardContent>
                <IntroduceTitle
                  sx={{
                    fontSize: { xs: "25px", md: "30px" },
                  }}
                  component="div"
                >
                  Hey, wait...
                </IntroduceTitle>
                <IntroduceDesc variant="span">
                  Trước khi rời đi, xin một đóng góp ý kiến của bạn về website này nhé!!
                </IntroduceDesc>
              </CardContent>
              <CardActions
                sx={{
                  padding: "0 16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                <Tooltip title="Thích">
                  <Badge color="secondary" badgeContent={data ? data.home_express1 : 0} max={99999}>
                    <IconButton onClick={() => handleClickExpress(1)}>
                      <IconExpress1 />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <Tooltip title="Cực Thích">
                  <Badge color="secondary" badgeContent={data ? data.home_express2 : 0} max={99999}>
                    <IconButton onClick={() => handleClickExpress(2)}>
                      <IconExpress2 />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <Tooltip title="Bình thường">
                  <Badge color="secondary" badgeContent={data ? data.home_express3 : 0} max={99999}>
                    <IconButton onClick={() => handleClickExpress(3)}>
                      <IconExpress3 />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <Tooltip title="Chán">
                  <Badge color="secondary" badgeContent={data ? data.home_express4 : 0} max={99999}>
                    <IconButton onClick={() => handleClickExpress(4)}>
                      <IconExpress4 />
                    </IconButton>
                  </Badge>
                </Tooltip>
              </CardActions>
            </Box>
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                flex: 1,
                display: { xs: "none", md: "block" },
              }}
              height="240"
              image="https://i.imgur.com/jziB6hJ.png"
              alt="Lethinh blog"
            />
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default memo(Introduce);
