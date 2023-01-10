import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import Email from "../auth/Email";
import ShareButton from "../ShareSocial/ShareButton";
const DescCode = (props) => {
  const { sourceCode, status } = props;
  const [isEmailModal, setIsEmailModal] = useState(false);

  const handleClickOpenEmail = () => {
    setIsEmailModal(true);
  };
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  useEffect(() => {
    const getImage = document.querySelectorAll(".image_resized");
    if (getImage.length > 0) {
      getImage.forEach((item, i) => {
        item.style.width = null;
      });
    }
  }, [sourceCode]);
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

          width: { xs: "100%", lg: "calc(100% - 260px)" },
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",

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
          <Email isEmailModal={isEmailModal} setIsEmailModal={setIsEmailModal} sourceCode={sourceCode} />
          <Typography component={"h1"} sx={{ fontFamily: "Noto Sans", fontSize: { xs: "3.5rem" }, fontWeight: "bold" }}>
            {sourceCode.title}
          </Typography>
          {sourceCode.updatedAt && (
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              📅 Cập nhật: <ReactTimeago date={sourceCode.updatedAt} />
            </Typography>
          )}
          <Typography component="div" sx={{ fontFamily: "Noto Sans", width: "100%" }}>
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
            <ShareButton blogData={sourceCode} />
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
