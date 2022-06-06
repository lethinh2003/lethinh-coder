import { Box } from "@mui/material";
import { memo } from "react";
const Tag = (props) => {
  const { sourceCode } = props;

  return (
    <>
      {sourceCode && (
        <>
          <h1 className="title">Tag</h1>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "20px",
              padding: { xs: "0 10px", md: "0 40px" },
              fontFamily: "Noto Sans",
              opacity: "0.7",
            }}
          >
            {sourceCode.keywords.join(", ")}
          </Box>
        </>
      )}
    </>
  );
};
export default memo(Tag);
