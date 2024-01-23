import { Box } from "@mui/material";
import { kv } from "@vercel/kv";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ItemReaction from "./ItemReaction";
const typeReaction = [
  {
    key: "likes",
    value: "Likes",
    img: "https://i.imgur.com/Z4rOLhy.png",
    count: 0,
  },
  {
    key: "loves",
    value: "Loves",
    img: "https://i.imgur.com/zBiZpzB.png",
    count: 0,
  },
  {
    key: "claps",
    value: "Claps",
    img: "https://i.imgur.com/9a1PuLJ.png",
    count: 0,
  },
  {
    key: "happies",
    value: "Happies",
    img: "https://i.imgur.com/AFH5IOQ.png",
    count: 0,
  },
];
const Reaction = ({ dataId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listReaction, setListReaction] = useState(typeReaction);

  useEffect(() => {
    const fetchDataReaction = async () => {
      try {
        setIsLoading(true);
        const listString = {};
        listString[`reaction-${dataId}-likes`] = 0;
        listString[`reaction-${dataId}-loves`] = 0;
        listString[`reaction-${dataId}-claps`] = 0;
        listString[`reaction-${dataId}-happies`] = 0;
        // set init counter if does not exist
        await kv.msetnx(listString);
        // get counter
        const getData = await kv.mget([
          `reaction-${dataId}-likes`,
          `reaction-${dataId}-loves`,
          `reaction-${dataId}-claps`,
          `reaction-${dataId}-happies`,
        ]);

        // set list data after have counters
        let listReactionCopied = [...listReaction];
        getData.forEach((counter, i) => {
          const currentReaction = listReactionCopied[i];
          currentReaction.count = counter;
        });
        setIsLoading(false);
        setListReaction(listReactionCopied);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    fetchDataReaction();
  }, [dataId]);

  const handleClickReation = async (type) => {
    try {
      const key = `reaction-${dataId}-${type}`;
      // check key exists
      const checkKey = await kv.exists(key);
      if (checkKey === 0) {
        return;
      }
      setIsLoading(true);

      // increment counter
      const res = await kv.incr(key);
      // set list again
      let listReactionCopied = [...listReaction];
      const currentReaction = listReactionCopied.find((item) => item.key === type);
      currentReaction.count = res;
      setListReaction(listReactionCopied);

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
        {listReaction.map((item, i) => {
          return <ItemReaction key={i} item={item} handleClickReation={handleClickReation} />;
        })}
      </Box>
    </>
  );
};
export default Reaction;
