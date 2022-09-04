import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { toast } from "react-toastify";
const SavedBlog = (props) => {
  const { blogData } = props;
  const [dataBlog, setDataBlog] = useState(blogData);
  const [isLoading, setIsLoading] = useState(false);

  const ReactionButton = styled(Box)({
    boxShadow: "none",
    fontSize: "1.4rem",
    borderRadius: "30px",
    minWidth: "70px",

    color: "#0b9ad1",
    fontWeight: "bold",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "5px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#E5E7EB",
      borderColor: "#005cbf",
    },

    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });
  const handleClickSaved = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/blogs/saved`, {
        blogID: dataBlog._id,
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          pointerEvents: isLoading ? "none" : "auto",
          opacity: isLoading ? "0.7" : "1",
        }}
      >
        <ReactionButton
          onClick={() => handleClickSaved()}
          as={motion.div}
          whileTap={{
            scale: 0.9,
          }}
        >
          <Box
            sx={{
              fontSize: "3rem",
            }}
          >
            <BsBookmarkFill />
          </Box>
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Save
          </Typography>
        </ReactionButton>
      </Box>
    </>
  );
};
export default memo(SavedBlog);
