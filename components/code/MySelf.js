import { Box, IconButton, Typography, Card, CardContent, CardMedia } from "@mui/material";

import { SiZalo } from "react-icons/si";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { styled } from "@mui/material/styles";
const MySelf = (props) => {
  const { systemData } = props;
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
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",
  });
  const CodeTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "25px",
    fontWeight: "bold",
  });
  const CodeTitleSecond = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "18px",
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
  return (
    <>
      {systemData.length > 0 && (
        <>
          <h1 className="title">MYSELF</h1>
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
                component="img"
                sx={{ height: 100, width: 100, objectFit: "cover", borderRadius: "10px" }}
                image={systemData[0].myself_avatar}
                alt={systemData[0].myself_name}
              />
              <CardContent
                sx={{
                  padding: "unset",
                }}
              >
                <Typography sx={{ fontFamily: "Noto Sans", fontWeight: "bold" }} component="div" variant="div">
                  {systemData[0].myself_name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: "Noto Sans",
                  }}
                  color="text.secondary"
                  component="div"
                >
                  {systemData[0].myself_desc}
                </Typography>
              </CardContent>
              <Typography sx={{ fontFamily: "Noto Sans", fontWeight: "bold" }} component="div" variant="div">
                Theo dõi tôi
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <a href={systemData[0].myself_fb} target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="fb">
                    <FacebookIcon />
                  </IconButton>
                </a>
                <a href={systemData[0].myself_zalo} target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="zalo">
                    <SiZalo />
                  </IconButton>
                </a>
                <a href={systemData[0].myself_instagram} target="_blank" rel="noopener noreferrer">
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
export default MySelf;
