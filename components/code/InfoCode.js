import { Box, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import blurImage from "../../public/blur_image.png";
import { convertTimeAgo } from "../../utils/convertTime";
const InfoCode = ({ sourceCode: { title, views, images, costs, downloads, createdAt, labels } }) => {
  const TagButton = styled(Box)({
    boxShadow: "none",
    fontSize: "1.3rem",
    borderRadius: "20px",
    textTransform: "lowercase",
    fontFamily: "Noto Sans",
    color: "#4b5563",
    fontWeight: "bold",
    backgroundColor: "#e5e6e9",
    padding: "5px 10px",
    cursor: "pointer",
  });
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            width: "100%",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              height: "200px",
              width: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0px 5px 50px 0px #52f18a, 0px 0px 0px 7px rgb(31 195 127)",
            }}
          >
            <Image
              src={images[0]}
              layout="fill"
              objectFit="cover"
              alt={title}
              placeholder="blur"
              blurDataURL={blurImage}
            />
          </Box>
          <CardContent
            sx={{
              borderRadius: "20px",
              boxShadow: "0px 2px 7px 2px #1abd79",
              border: "2px solid #17d289",
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              📁 Tên code: {title}{" "}
            </Typography>

            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              💰 Phí tải:{" "}
              <NumericFormat
                value={costs}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                suffix={" VNĐ"}
              />
            </Typography>
            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              📥 Lượt tải: {downloads}{" "}
            </Typography>
            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              📅 Thời gian: {convertTimeAgo(createdAt)}
            </Typography>
            {labels.length > 0 && (
              <Box
                sx={{
                  fontWeight: "500",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "500",
                  }}
                >
                  🏷️ Labels:{" "}
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {labels.map((item, i) => (
                    <Link key={i} href={`/source-code/label/${encodeURIComponent(item)}`}>
                      <TagButton>#{item}</TagButton>
                    </Link>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Box>
      </Box>
    </>
  );
};
export default InfoCode;
