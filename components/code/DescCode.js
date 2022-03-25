import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import convertTime from "../../utils/convertTime";
import Email from "../auth/Email";

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
        <h1 className="title">Desciption code</h1>
        {sourceCode.length > 0 &&
          sourceCode.map((item, i) => {
            return (
              <Box
                key={i}
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
                <Email isEmailModal={isEmailModal} setIsEmailModal={setIsEmailModal} codeId={sourceCode[0]._id} />
                <h1 style={{ fontFamily: "Noto Sans" }}>{item.title}</h1>
                {item.updatedAt && (
                  <Typography
                    sx={{
                      fontWeight: "500",
                    }}
                  >
                    <AiOutlineCalendar /> Cập nhật: {convertTime(sourceCode[0].updatedAt)}{" "}
                  </Typography>
                )}
                <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
                  <div className="content-html" dangerouslySetInnerHTML={{ __html: item.content }} />
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
                  {status === "authenticated" && sourceCode[0].costs === 0 ? (
                    <Button variant="outlined" onClick={() => handleClickOpenEmail()}>
                      Download Code
                    </Button>
                  ) : (
                    <Button variant="outlined">Đăng Nhập Để Download Code</Button>
                  )}
                </Typography>
              </Box>
            );
          })}
      </Box>
    </>
  );
};
export default DescCode;
