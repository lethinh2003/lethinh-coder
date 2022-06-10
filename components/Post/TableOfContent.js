import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { memo } from "react";
import { styled } from "@mui/material/styles";

const TableOfContent = (props) => {
  const { dataPost } = props;
  const [listContents, setListContents] = useState([]);
  const [isContentPos, setIsContentPos] = useState("");
  useEffect(() => {
    const data = [];
    const getH1elements = document.querySelectorAll(".content-html h2");
    if (getH1elements.length > 0) {
      for (let i = 0; i < getH1elements.length; i++) {
        data.push(getH1elements[i]);
      }
    }
    setListContents(data);
  }, [dataPost]);
  useEffect(() => {
    const eventScroll = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (listContents.length > 0) {
        if (c < listContents[0].offsetTop - listContents[0].offsetHeight) {
          setIsContentPos("");
        } else {
          listContents.map((item) => {
            if (c >= item.offsetTop - item.offsetHeight) {
              setIsContentPos(item.innerText);
            }
          });
        }
      }
    };
    document.addEventListener("scroll", eventScroll);
    return () => {
      document.removeEventListener("scroll", eventScroll);
    };
  }, [listContents]);

  const handleClickContent = (item) => {
    // window.scrollTo(0, item.offsetTop - item.offsetHeight * 2);
    item.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const TitleContent = styled(Typography)({
    fontFamily: "Bebas Neue",
    position: "relative",
    fontSize: "3rem",
    fontWeight: "bold",
  });

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "background.default",
          justifyContent: "center",
          color: "text.primary",
          gap: "10px",
          padding: "40px 0",
          position: "-webkit-sticky",
          position: "sticky",
          top: 5,
        }}
      >
        <TitleContent
          sx={{
            paddingTop: "30px",
          }}
          className="title"
        >
          Table of Contents
        </TitleContent>
        <Box
          className="tableofcontents"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "10px", md: "20px" },
            width: "300px",
            borderLeft: "1px solid #ccc",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {listContents.length > 0 &&
            listContents.map((item, i) => (
              <Typography
                className={item.innerText === isContentPos ? "table_content active" : "table_content"}
                onClick={() => handleClickContent(item)}
                key={i}
              >
                {item.innerText}
              </Typography>
            ))}
        </Box>
      </Box>
    </>
  );
};
export default memo(TableOfContent);
