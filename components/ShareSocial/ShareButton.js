import { Box } from "@mui/material";
import { memo, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const ShareButton = (props) => {
  const { blogData } = props;
  const [dataBlog, setDataBlog] = useState(blogData);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {typeof window !== "undefined" && (
          <>
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={40} borderRadius={10} />
            </FacebookShareButton>
            <LinkedinShareButton url={window.location.href}>
              <LinkedinIcon size={40} borderRadius={10} />
            </LinkedinShareButton>
            <TwitterShareButton url={window.location.href}>
              <TwitterIcon size={40} borderRadius={10} />
            </TwitterShareButton>
            <RedditShareButton url={window.location.href}>
              <RedditIcon size={40} borderRadius={10} />
            </RedditShareButton>
            <TelegramShareButton url={window.location.href}>
              <TelegramIcon size={40} borderRadius={10} />
            </TelegramShareButton>
          </>
        )}
        {/* <ShareSocial url={window.location.href} socialTypes={["facebook", "twitter", "reddit", "linkedin"]} /> */}
      </Box>
    </>
  );
};
export default memo(ShareButton);
