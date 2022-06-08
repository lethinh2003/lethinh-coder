import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import convertTime from "../../utils/convertTime";
import Email from "../auth/Email";
import { memo } from "react";
const DescCode = (props) => {
  const { sourceCode, status } = props;
  const [isEmailModal, setIsEmailModal] = useState(false);

  const handleClickOpenEmail = () => {
    setIsEmailModal(true);
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
          padding: "40px 0",
        }}
      >
        <Typography className="title">Desciption code</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "10px", md: "20px" },
          }}
        >
          <Email isEmailModal={isEmailModal} setIsEmailModal={setIsEmailModal} codeId={sourceCode._id} />
          <h1 style={{ fontFamily: "Noto Sans" }}>{sourceCode.title}</h1>
          {sourceCode.updatedAt && (
            <Typography
              sx={{
                fontWeight: "500",
              }}
            >
              <AiOutlineCalendar /> Cập nhật: {convertTime(sourceCode.updatedAt)}{" "}
            </Typography>
          )}
          <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
            <div className="content-html" dangerouslySetInnerHTML={{ __html: sourceCode.content }} />
          </Typography>
          <Typography
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {status === "authenticated" && sourceCode.costs === 0 && (
              <Button variant="outlined" onClick={() => handleClickOpenEmail()}>
                Download Code
              </Button>
            )}
            {status === "unauthenticated" && sourceCode.costs === 0 && (
              <Button variant="outlined">Đăng Nhập Để Download Code</Button>
            )}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default memo(DescCode);
