import { Box } from "@mui/material";
const InfoBlog = (props) => {
  const { blogData } = props;
  return (
    <>
      {blogData && (
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
        ></Box>
      )}
    </>
  );
};
export default InfoBlog;
