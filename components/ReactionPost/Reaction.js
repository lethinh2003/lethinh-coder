import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ItemReaction from "./ItemReaction";
const Reaction = (props) => {
  const { blogData } = props;
  const [dataBlog, setDataBlog] = useState(blogData);
  const [isLoading, setIsLoading] = useState(false);

  const typeReaction = [
    {
      key: "likes",
      value: "Likes",
      img: "https://i.imgur.com/Z4rOLhy.png",
    },
    {
      key: "loves",
      value: "Loves",
      img: "https://i.imgur.com/zBiZpzB.png",
    },
    {
      key: "claps",
      value: "Claps",
      img: "https://i.imgur.com/9a1PuLJ.png",
    },
    {
      key: "happies",
      value: "Happies",
      img: "https://i.imgur.com/AFH5IOQ.png",
    },
  ];
  const handleClickReation = async (type) => {
    try {
      setIsLoading(true);

      const res = await axios.post(`${process.env.ENDPOINT_SERVER}/api/v1/blogs/reactions`, {
        id: dataBlog._id,
        type: type,
      });
      setDataBlog(res.data.data);

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
        {typeReaction.map((item, i) => {
          return <ItemReaction dataBlog={dataBlog} key={i} item={item} handleClickReation={handleClickReation} />;
        })}
      </Box>
    </>
  );
};
export default memo(Reaction);
