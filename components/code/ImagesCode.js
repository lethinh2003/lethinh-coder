import { Typography } from "@mui/material";
import { useState } from "react";
import Lightbox from "react-image-lightbox";

const ImagesCode = (props) => {
  const { sourceCode, status } = props;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);

  const handleClickOpenLightBoxImage = (index) => {
    setPhotoIndex(index);
    setIsOpenLightBox(true);
  };
  const imagesLightBox = sourceCode.length > 0 ? sourceCode[0].images : [];

  return (
    <>
      <h1 className="title">Images</h1>
      {isOpenLightBox && imagesLightBox.length > 0 && (
        <Lightbox
          mainSrc={imagesLightBox[photoIndex]}
          nextSrc={imagesLightBox[(photoIndex + 1) % imagesLightBox.length]}
          prevSrc={imagesLightBox[(photoIndex + imagesLightBox.length - 1) % imagesLightBox.length]}
          onCloseRequest={() => setIsOpenLightBox(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + imagesLightBox.length - 1) % imagesLightBox.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imagesLightBox.length)}
        />
      )}
      {sourceCode.length > 0 &&
        sourceCode.map((item, i) => {
          return (
            <Typography
              component="div"
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.images.length > 0 &&
                item.images.map((im, i) => {
                  return (
                    <img
                      loading="lazy"
                      onClick={() => handleClickOpenLightBoxImage(i)}
                      alt={item.title}
                      key={i}
                      src={im}
                      style={{
                        maxWidth: "600px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
            </Typography>
          );
        })}
    </>
  );
};
export default ImagesCode;
