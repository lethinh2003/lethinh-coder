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
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import NumberFormat from "react-number-format";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { GrFormView } from "react-icons/gr";
import convertTime from "../../utils/convertTime";
const ShowBlogs = (props) => {
  const [blogData, setBlogData] = useState(JSON.parse(props.blogData));

  const theme = useTheme();
  const CardCode = styled(Card)(({ theme }) => ({
    padding: "15px",
    borderRadius: "20px",
    maxWidth: 400,
    width: "100%",
    overflow: "unset",
    scrollSnapAlign: "center",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,
    justifySelf: "center",

    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));
  const CardContentCode = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    maxHeight: "145px",
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
  const BoxCodeTitle = styled(Box)({
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
  });
  const CodeButton = styled(Button)({
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",

          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
          padding: "40px 0",
        }}
      >
        <BoxCodeTitle>
          <CodeTitle
            component="h1"
            sx={{
              padding: { xs: "0 10px", md: "0 20px" },
            }}
          >
            {props.title}
          </CodeTitle>
          <Link href="/blog">
            <CodeTitleSecond
              sx={{
                padding: { xs: "0 10px", md: "0 20px" },
              }}
            >
              See all
            </CodeTitleSecond>
          </Link>
        </BoxCodeTitle>
        <Box
          sx={{
            padding: { xs: "10px", md: "20px" },
            width: "100%",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(3, 1fr)" },
              gap: "10px",
            }}
          >
            {blogData.length > 0 &&
              blogData.map((item, i) => {
                return (
                  <CardCode key={i}>
                    <CardContentCode>
                      <Link href={`/blog/${item.slug}`}>
                        <CardContentCodeTitle component="div" className="code-title">
                          {item.title}
                        </CardContentCodeTitle>
                      </Link>

                      <Typography className="code-container__body--desc" sx={{ fontFamily: "IBM Plex Sans" }}>
                        <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                          <Typography
                            sx={{
                              fontSize: { xs: "14px", md: "16px" },
                            }}
                          >
                            {convertTime(item.createdAt)} - {item.readTime} phút đọc/{item.views} views
                          </Typography>
                        </Typography>
                      </Typography>
                      <Typography sx={{ marginTop: "20px" }}>
                        {item.costs > 0 && (
                          <CodeButton variant="outlined">
                            <NumberFormat
                              value={item.costs}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              suffix={" VNĐ"}
                            />
                          </CodeButton>
                        )}
                        {item.costs === 0 && <CodeButton variant="outlined">Free</CodeButton>}
                      </Typography>
                    </CardContentCode>
                    <CardMedia
                      className="code-container__image"
                      component="img"
                      height="140"
                      image={item.images[0]}
                      alt={item.title}
                      sx={{
                        borderRadius: "20px",
                      }}
                    />
                  </CardCode>
                );
              })}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default ShowBlogs;
