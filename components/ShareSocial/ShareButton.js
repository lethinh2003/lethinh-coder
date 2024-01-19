import { Box } from "@mui/material";
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

const ShareButton = ({ url }) => {
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
        <FacebookShareButton url={url}>
          <FacebookIcon size={40} borderRadius={10} />
        </FacebookShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={40} borderRadius={10} />
        </LinkedinShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={40} borderRadius={10} />
        </TwitterShareButton>
        <RedditShareButton url={url}>
          <RedditIcon size={40} borderRadius={10} />
        </RedditShareButton>
        <TelegramShareButton url={url}>
          <TelegramIcon size={40} borderRadius={10} />
        </TelegramShareButton>
      </Box>
    </>
  );
};
export default ShareButton;
