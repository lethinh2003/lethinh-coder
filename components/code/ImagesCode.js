import { Typography } from "@mui/material";
import { useState } from "react";
import Lightbox from "react-image-lightbox";
import { memo } from "react";
import Image from "next/image";
const ImagesCode = (props) => {
  const { sourceCode, status } = props;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpenLightBox, setIsOpenLightBox] = useState(false);

  const handleClickOpenLightBoxImage = (index) => {
    setPhotoIndex(index);
    setIsOpenLightBox(true);
  };
  const imagesLightBox = sourceCode ? sourceCode.images : [];
  const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  const triplet = (e1, e2, e3) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63);

  const rgbDataURL = (r, g, b) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
  return (
    <>
      <Typography className="title">Images</Typography>
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

      <Typography
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {sourceCode.images.length > 0 &&
          sourceCode.images.map((im, i) => {
            return (
              <Image
                key={i}
                onClick={() => handleClickOpenLightBoxImage(i)}
                width={900}
                height={400}
                src={im}
                alt={sourceCode.title}
                objectFit="cover"
                placeholder="blur"
                blurDataURL="https://i.imgur.com/HYNKD6V.png"
              />
            );
          })}
      </Typography>
    </>
  );
};
export default memo(ImagesCode);
