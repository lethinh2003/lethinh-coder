import { Box, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import blurImage from "../../public/blur_image.png";
const TitleContent = styled(Typography)({
  fontFamily: "Bebas Neue",
  position: "relative",
  fontSize: "3rem",
  fontWeight: "bold",
});
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
        <TitleContent
          component="h1"
          className="title"
          sx={{ fontFamily: "Bebas Neue", fontSize: "4rem", fontWeight: "bold" }}
        >
          LeThinh's Blog
        </TitleContent>
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
          <CardMedia
            sx={{
              height: 120,
              width: 130,
              objectFit: "cover",
              borderRadius: "50%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src={data.myself_avatar}
              layout="fill"
              objectFit="cover"
              alt={data.meta_desc}
              placeholder="blur"
              blurDataURL={blurImage}
            />
          </CardMedia>

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
export default Introduce;
