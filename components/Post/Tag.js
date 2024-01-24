import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Tag = (props) => {
  const { data } = props;
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });

  return (
    <>
      {data && (
        <>
          <TitleContent className="title" component="h2">
            Tags
          </TitleContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "1.5rem",
              padding: { xs: "0 10px", md: "0 20px" },

              opacity: "0.7",
              color: "text.secondary",
            }}
            component={"p"}
          >
            {data.keywords.join(", ")}
          </Box>
        </>
      )}
    </>
  );
};
export default Tag;
