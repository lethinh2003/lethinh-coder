import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useState } from "react";
import NumberFormat from "react-number-format";
import convertTime from "../../utils/convertTime";
import { memo } from "react";
import getReadingTime from "../../utils/getReadingTime";
import Image from "next/image";

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
    maxHeight: "160px",
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
            padding: { xs: "10px", md: "20px 100px" },
            width: "100%",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0,1fr))",
                md: "repeat(2, minmax(0,1fr))",
                lg: "repeat(3, minmax(0,1fr))",
              },
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
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography>📆 {convertTime(item.createdAt)}</Typography>
                            <Typography>
                              🕐 {getReadingTime(item.content)} phút đọc/{item.views} views
                            </Typography>
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
                    <Box
                      className="code-container__image"
                      height="140"
                      sx={{
                        borderRadius: "20px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.images[0]}
                        layout="fill"
                        objectFit="cover"
                        alt={item.title}
                        placeholder="blur"
                        blurDataURL="https://i.imgur.com/HYNKD6V.png"
                      />
                    </Box>
                  </CardCode>
                );
              })}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default memo(ShowBlogs);
