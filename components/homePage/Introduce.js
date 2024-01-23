import { Avatar, Box, Typography } from "@mui/material";
import { memo } from "react";

const Introduce = ({ dataSystem }) => {
  let data = JSON.parse(dataSystem);

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
            display: "flex",
            gap: "10px",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            padding: { xs: "10px", md: "10px 20px" },
          }}
        >
          <Avatar
            alt={data?.meta_desc}
            sx={{ width: 128, height: 128 }}
            src={data?.myself_avatar || "https://i.imgur.com/tAB8VeI.jpg"}
          />
          {/* <Box
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
              Hello👋, I'm Thinh Le
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
          </Box> */}
          <Typography component="div" sx={{ fontFamily: "Noto Sans", width: "100%" }}>
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: data?.home_introduce || "No data system found" }}
            />
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default memo(Introduce);
