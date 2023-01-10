import { Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { memo } from "react";

const Introduce = (props) => {
  const IntroduceButton = styled(Button)({
    boxShadow: "none",
    fontSize: "1.4rem",
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
    color: "#fff",
  });
  const IntroduceDesc = styled(Typography)({
    fontSize: "1.5rem",
    fontFamily: "Noto Sans",
    color: "#fff",
  });

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
            bgcolor: "background.default",
            justifyContent: "space-between",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "10px", md: "10px 20px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              backgroundImage: "linear-gradient(120deg,#3693b7,#10e5e5)",
              minHeight: 250,
              width: { xs: "100%", md: "60%" },
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              boxShadow: "2px 3px 8px 0px #53cecf",
            }}
          >
            <Box>
              <CardContent>
                <IntroduceTitle
                  sx={{
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  Tải xuống mã nguồn miễn phí
                </IntroduceTitle>
                <IntroduceDesc variant="span">Hệ thống chia sẻ mã nguồn miễn phí, chất lượng</IntroduceDesc>
              </CardContent>
              <CardActions
                sx={{
                  padding: "0 16px",
                }}
              >
                <Link href="/source-code">
                  <IntroduceButton size="small" variant="contained">
                    Xem ngay
                  </IntroduceButton>
                </Link>
              </CardActions>
            </Box>
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                flex: 1,
                display: { xs: "none", md: "none" },
              }}
              height="240"
              image="https://i.imgur.com/behNN0y.png"
              alt="Lethinh blog"
            />
          </Card>

          <Box
            sx={{
              flex: "1",
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: { xs: "row", md: "column" },
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <Card
              sx={{
                position: "relative",
                height: "50%",
                width: "100%",
                borderRadius: "20px",
                backgroundImage: "linear-gradient(120deg,#36b794,#16d287)",
                display: "flex",
                alignItems: "center",
                boxShadow: "2px 3px 8px 0px #33b993",
              }}
            >
              <Box>
                <CardContent>
                  <IntroduceDesc variant="span">Các bài blog đa dạng, hấp dẫn</IntroduceDesc>
                </CardContent>
                <CardActions
                  sx={{
                    padding: "10 16px",
                  }}
                >
                  <Link href="/blog">
                    <IntroduceButton size="small" variant="contained">
                      Xem ngay
                    </IntroduceButton>
                  </Link>
                </CardActions>
              </Box>
              <CardMedia
                component="img"
                sx={{
                  objectFit: "contain",
                  flex: 1,
                  display: { xs: "none", md: "block" },
                }}
                height="120"
                image="https://i.imgur.com/ijFCA3o.png"
                alt="Lethinh blog"
              />
            </Card>
            <Card
              sx={{
                width: "100%",
                height: "50%",
                borderRadius: "20px",
                backgroundImage: "linear-gradient(120deg,#d53e3e,#e51055)",
                display: "flex",
                alignItems: "center",
                boxShadow: "2px 3px 8px 0px #d73841",
              }}
            >
              <Box>
                <CardContent>
                  <IntroduceDesc variant="span">Chia sẻ các thủ thuật máy tính</IntroduceDesc>
                </CardContent>
                <CardActions
                  sx={{
                    padding: "10 16px",
                  }}
                >
                  <Link href="/blog">
                    <IntroduceButton size="small" variant="contained">
                      Xem ngay
                    </IntroduceButton>
                  </Link>
                </CardActions>
              </Box>
              <CardMedia
                component="img"
                sx={{
                  objectFit: "contain",
                  flex: 1,
                  display: { xs: "none", md: "block" },
                }}
                height="150"
                image="https://i.imgur.com/xrUydfJ.png"
                alt="Lethinh blog"
              />
            </Card>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            padding: { xs: "10px", md: "10px 20px" },
          }}
        >
          <Avatar
            alt="Le Van Thinh - LeThinh Blog"
            sx={{ width: 128, height: 128 }}
            src={"https://i.imgur.com/i5MCT4h.jpg"}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              color: "text.secondary",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "2rem",
              }}
            >
              Hello👋, I'm Le Van Thinh
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
              }}
            >
              I currently study at HoChiMinh University of Education (HCMUE) with Information Technology majors 👨‍💻.
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
              }}
            >
              I 💕 Website Technology, especially ReactJS, NextJS, bra bra...
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
              }}
            >
              Welcome to my blog where I share about source code, my daily life hehe.
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
              }}
            >
              If you like any blog or any source code, let's share it for somebody 🤲.
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
              }}
            >
              Follow me 😎:{" "}
              <a
                href="https://www.facebook.com/thinhvle2210"
                target={"_blank"}
                style={{
                  color: "#f06668",
                }}
              >
                Facebook
              </a>
              ,{" "}
              <a
                target={"_blank"}
                href="https://github.com/lethinh2003"
                style={{
                  color: "#f06668",
                }}
              >
                Github
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default memo(Introduce);
