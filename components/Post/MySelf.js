import { Box, IconButton, Typography, Card, CardContent, CardMedia } from "@mui/material";

import { SiZalo } from "react-icons/si";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const MySelf = (props) => {
  // const { dataSystem } = props;
  const dataSystem = useSelector((state) => state.system.data);

  const CardCode = styled(Card)(({ theme }) => ({
    padding: "15px",
    borderRadius: "20px",
    minWidth: 300,
    overflow: "unset",
    scrollSnapAlign: "center",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,

    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));
  const CardContentCode = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    maxHeight: "130px",
    height: "100%",
  });
  const CardContentCodeTitle = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",
  });
  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  const CodeTitleSecond = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "1.8rem",
    fontWeight: "bold",
    opacity: 0.8,
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
    },

    "&:active, &:focus": {
      color: "#0b9ad1",
    },
  });
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
  });
  return (
    <>
      {dataSystem && (
        <>
          <TitleContent className="title">MYSELF</TitleContent>
          <CardCode sx={{ display: "flex", padding: "20px 0px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "20px",
                padding: { xs: "0 10px", md: "0 40px" },
              }}
            >
              <CardMedia
                sx={{
                  height: 100,
                  width: 100,
                  objectFit: "cover",
                  borderRadius: "10px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={dataSystem.myself_avatar}
                  layout="fill"
                  objectFit="cover"
                  alt={dataSystem.myself_name}
                  placeholder="blur"
                  blurDataURL="https://i.imgur.com/HYNKD6V.png"
                />
              </CardMedia>
              <CardContent
                sx={{
                  padding: "unset",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }} component="div">
                  {dataSystem.myself_name}
                </Typography>
                <Typography color="text.secondary" component="div">
                  {dataSystem.myself_desc}
                </Typography>
              </CardContent>
              <Typography sx={{ fontWeight: "bold" }} component="div">
                Theo dõi tôi
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <a href={dataSystem.myself_fb} target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="fb">
                    <FacebookIcon />
                  </IconButton>
                </a>
                <a href={dataSystem.myself_zalo} target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="zalo">
                    <SiZalo />
                  </IconButton>
                </a>
                <a href={dataSystem.myself_instagram} target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="instagram">
                    <InstagramIcon />
                  </IconButton>
                </a>
              </Box>
            </Box>
          </CardCode>
        </>
      )}
    </>
  );
};
export default memo(MySelf);
