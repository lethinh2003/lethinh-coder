import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { styled } from "@mui/material/styles";

const Tag = (props) => {
  const { data } = props;
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
  });

  return (
    <>
      {data && (
        <>
          <TitleContent className="title">Tags</TitleContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "2rem",
              padding: { xs: "0 10px", md: "0 20px" },
              fontFamily: "Noto Sans",
              opacity: "0.7",
            }}
          >
            {data.keywords.join(", ")}
          </Box>
        </>
      )}
    </>
  );
};
export default memo(Tag);
