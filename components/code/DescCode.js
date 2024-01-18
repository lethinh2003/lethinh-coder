import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { convertTimeAgo } from "../../utils/convertTime";
import ShareButton from "../ShareSocial/ShareButton";
import CodeDownloadModal from "./CodeDownloadModal";
const DescCode = ({ sourceCode }) => {
  const { status } = useSession();
  const [isOpenDownloadModal, setIsOpenDownloadModal] = useState(false);

  useEffect(() => {
    const getImage = document.querySelectorAll(".image_resized");
    if (getImage.length > 0) {
      getImage.forEach((item, i) => {
        item.style.width = null;
      });
    }
  }, [sourceCode]);

  const handleClickOpenDownloadModal = () => {
    setIsOpenDownloadModal(true);
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
          <CodeDownloadModal
            isOpenModal={isOpenDownloadModal}
            setIsOpenModal={setIsOpenDownloadModal}
            sourceCode={sourceCode}
          />

          <Typography component={"h1"} sx={{ fontFamily: "Noto Sans", fontSize: { xs: "3.5rem" }, fontWeight: "bold" }}>
            {sourceCode.title}
          </Typography>
          {sourceCode.updatedAt && (
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              📅 Cập nhật: {convertTimeAgo(sourceCode.updatedAt)}
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
            <ShareButton blogData={sourceCode} />
            {status === "authenticated" && sourceCode.costs === 0 && (
              <Button variant="outlined" onClick={() => handleClickOpenDownloadModal()}>
                Download Code
              </Button>
            )}
            {status === "unauthenticated" && sourceCode.costs === 0 && (
              <Link href={`/login?callbackUrl=${encodeURIComponent(`/source-code/${sourceCode.slug}`)}`}>
                <Button variant="outlined">Đăng Nhập Để Download Code</Button>
              </Link>
            )}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default DescCode;
