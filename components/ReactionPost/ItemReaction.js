import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";
const ItemReaction = ({ item, handleClickReation }) => {
  const ReactionButton = styled(Box)({
    boxShadow: "none",
    fontSize: "1.4rem",
    borderRadius: "30px",
    minWidth: "70px",
    border: "1px solid ",

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
  return (
    <>
      <ReactionButton
        onClick={() => handleClickReation(item.key)}
        as={motion.div}
        whileTap={{
          scale: 0.9,
        }}
      >
        <Image src={item.img} width={35} height={35} objectFit="cover" alt={item.values} />
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          {item.count}
        </Typography>
      </ReactionButton>
    </>
  );
};

export default memo(ItemReaction);
