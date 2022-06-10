import { Box, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useRef, useState } from "react";
import convertTime from "../../utils/convertTime";
import getReadingTime from "../../utils/getReadingTime";
import Image from "next/image";
const NewBlogs = (props) => {
  const [newBlog, setNewBlog] = useState(props.newBlog);

  const AllBlog = useRef();

  const BlogTitle = styled(Typography)({
    fontFamily: "Noto sans",
    fontSize: "2.5rem",
    fontWeight: "bold",
  });
  const BoxNewBlog = styled(Box)({
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    gap: "20px",
  });
  const BoxChild1NewBlog = styled(Box)({
    display: "flex",
    flexDirection: "column",

    gap: "10px",
  });
  const BoxChild2NewBlog = styled(Box)({
    display: "flex",
    gap: "10px",
  });
  const ChildTitleNewBlog = styled(Typography)({
    fontFamily: "Noto Sans",
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  });
  const ChildImageNewBlog = styled(CardMedia)({
    width: "100%",
    height: "100%",
  });
  const Child2ImageNewBlog = styled(CardMedia)({
    minWidth: "250px",
    height: "150px",
    borderRadius: "10px",
  });

  return (
    <>
      <BlogTitle
        component="h1"
        sx={{
          padding: { xs: "0 10px", md: "0 20px" },
          alignSelf: "flex-start",
        }}
      >
        New Blog
      </BlogTitle>

      <BoxNewBlog
        sx={{
          padding: { xs: "0 10px", md: "0 20px" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {newBlog && newBlog.length > 0 && (
          <BoxChild1NewBlog
            sx={{
              width: { xs: "100%", md: "70%" },
            }}
          >
            <CardMedia
              sx={{
                width: "100%",
                height: "310px",
                borderRadius: "10px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                style={{
                  borderRadius: "10px",
                }}
                src={newBlog[0].images[0]}
                layout="fill"
                objectFit="cover"
                alt={newBlog[0].title}
                placeholder="blur"
                blurDataURL="https://i.imgur.com/HYNKD6V.png"
              />
            </CardMedia>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.4rem", md: "1.6rem" },
                }}
              >
                📆 {convertTime(newBlog[0].createdAt)}
              </Typography>
              <Link href={`blog/${newBlog[0].slug}`}>
                <ChildTitleNewBlog
                  sx={{
                    fontSize: { xs: "1.6rem", md: "1.8rem" },
                  }}
                >
                  {newBlog[0].title}
                </ChildTitleNewBlog>
              </Link>
              <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                  }}
                >
                  🕐 {getReadingTime(newBlog[0].content)} phút đọc
                </Typography>
              </Typography>
            </Box>
          </BoxChild1NewBlog>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {newBlog &&
            newBlog.slice(1).map((item, i) => (
              <BoxChild2NewBlog key={i}>
                <Child2ImageNewBlog
                  sx={{
                    minWidth: { xs: "150px", md: "250px" },
                    height: { xs: "100px", md: "150px" },
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.images[0]}
                    layout="fill"
                    objectFit="cover"
                    alt={item.title}
                    placeholder="blur"
                    blurDataURL="https://i.imgur.com/HYNKD6V.png"
                  />
                </Child2ImageNewBlog>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.4rem", md: "1.6rem" },
                    }}
                  >
                    📆 {convertTime(item.createdAt)}
                  </Typography>
                  <Link href={`blog/${item.slug}`}>
                    <ChildTitleNewBlog
                      sx={{
                        fontSize: { xs: "1.6rem", md: "1.8rem" },
                      }}
                    >
                      {item.title}
                    </ChildTitleNewBlog>
                  </Link>
                  <Typography sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.4rem", md: "1.6rem" },
                      }}
                    >
                      🕐 {getReadingTime(item.content)} phút đọc
                    </Typography>
                  </Typography>
                </Box>
              </BoxChild2NewBlog>
            ))}
        </Box>
      </BoxNewBlog>
    </>
  );
};
export default NewBlogs;
