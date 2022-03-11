import { Box, Typography, CardContent, CardMedia } from "@mui/material";
import convertTime from "../../utils/convertTime";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

import { AiFillFileZip, AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";

import NumberFormat from "react-number-format";

const InfoCode = (props) => {
  const { sourceCode } = props;

  return (
    <>
      {sourceCode.length > 0 && (
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link style={{ color: "inherit" }} href="/">
              Home
            </Link>
            <Link style={{ color: "inherit" }} href="/source-code">
              Source code
            </Link>
            <Typography color="text.primary">{sourceCode[0].title}</Typography>
          </Breadcrumbs>
          <h1 className="title">Trang thông tin code</h1>

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
            <CardMedia
              sx={{
                height: "200px",
                width: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0px 5px 50px 0px #52f18a, 0px 0px 0px 7px rgb(31 195 127)",
              }}
              component="img"
              image={sourceCode[0].images[0]}
              alt={sourceCode[0].title}
            />
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
                <AiFillFileZip /> Tên code: {sourceCode[0].title}{" "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                <AiOutlineEye /> Lượt xem: {sourceCode[0].views}{" "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                <FaMoneyCheckAlt /> Phí tải:{" "}
                <NumberFormat
                  value={sourceCode[0].costs}
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
                <BsCloudDownload /> Lượt tải: {sourceCode[0].downloads}{" "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                <AiOutlineCalendar /> Thời gian: {convertTime(sourceCode[0].createdAt)}{" "}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      )}
    </>
  );
};
export default InfoCode;
