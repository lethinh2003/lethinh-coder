import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import dbConnect from "../../database/dbConnect";
import Code from "../../models/Code";
import axios from "axios";
import NumberFormat from "react-number-format";
import convertToTime from "../../utils/convertTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Input,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LinkMUI from "@mui/material/Link";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MailIcon from "@mui/icons-material/Mail";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Head from "next/head";
import Lightbox from "react-image-lightbox";
import Email from "../../components/auth/Email";
import { AiFillFileZip, AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";
import Modal from "../../components/homePage/Modal";
import { SiZalo } from "react-icons/si";
import InstagramIcon from "@mui/icons-material/Instagram";
const DetailSourceCode = (props) => {
  const { data: session, status } = useSession();

  const { sourceBySlug, newSource } = props;
  const [sourceCode, setSourceCode] = useState(JSON.parse(sourceBySlug));
  const [listComments, setListComment] = useState([]);
  const [listCommentsAll, setListCommentAll] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreComments, setIsLoadMoreComments] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isEmailModal, setIsEmailModal] = useState(false);
  const [isGetListComments, setIsGetListComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const router = useRouter();
  const getPSComment = useRef();
  const getPSNewCode = useRef();

  useEffect(() => {
    const test2 = async () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;

      if (c >= getPSComment.current.offsetTop - 300 && isGetListComments === false) {
        await getAPI();
      }
    };
    const getAPI = async () => {
      if (isGetListComments === false) {
        setIsPostingComment(true);
        document.removeEventListener("scroll", test2);
        const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        if (isLoadMoreComments) {
          setListComment(getComments.data.data);
        } else {
          setListComment(getComments.data.data.slice(0, 5));
        }
        setListCommentAll(getComments.data.data);
        setIsGetListComments(true);
        setIsPostingComment(false);
      }
    };
    document.addEventListener("scroll", test2);
    return () => {
      document.removeEventListener("scroll", test2);
    };
  }, [sourceCode, isGetListComments]);

  const handleClickOpenEmail = () => {
    setIsEmailModal(true);
  };
  const handleClickCloseEmail = () => {
    setIsEmailModal(false);
  };
  const handleClickComment = async () => {
    if (comment.length >= 5 && isComment) {
      try {
        setIsPostingComment(true);
        const result = await axios.post("/api/source-code/comments", {
          codeId: sourceCode[0]._id,
          content: comment,
        });
        const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        if (isLoadMoreComments) {
          setListComment(getComments.data.data);
        } else {
          setListComment(getComments.data.data.slice(0, 5));
        }

        setListCommentAll(getComments.data.data);
        setComment("");
        setIsComment(false);

        setIsPostingComment(false);
      } catch (err) {
        setIsPostingComment(false);
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (sourceCode.length === 0) {
      return router.push("/");
    }

    const slug = router.query.slug.join("/");
    console.log(slug);
    const fetchAPI = async () => {
      try {
        setIsGetListComments(false);
        setIsLoadMoreComments(false);
        setListComment([]);
        setIsLoading(true);

        if (status === "authenticated") {
          const results = axios.get("/api/source-code/" + slug);
          const getHistoryCommentsLiked = axios.get("/api/history/history-like");

          await Promise.all([results, getHistoryCommentsLiked]).then((response) => {
            setSourceCode(response[0].data.data);
            if (response[1].data.data.length > 0) {
              const newArrayToPush = [];
              const listCommentsLiked = response[1].data.data;
              listCommentsLiked.map((item) => {
                newArrayToPush.push(item.comment[0]);
              });
              localStorage.setItem("listLikeComments", JSON.stringify(newArrayToPush));
            }
          });
        } else {
          const results = await axios.get("/api/source-code/" + slug);
          setSourceCode(results.data.data);
        }

        setIsLoading(false);
        setComment("");
        setIsComment(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    fetchAPI();
  }, [router.query.slug, status]);

  const images = sourceCode.length > 0 ? sourceCode[0].images : [];

  const handleClickOpenLightBoxImage = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };
  const handleChangeComment = (e) => {
    setIsComment(true);
    setComment(e.target.value);
  };
  const handleCLickLikeComment = async (commentId, accountId) => {
    if (status === "authenticated") {
      try {
        setIsLoading(true);
        const result = await axios.post("/api/source-code/comments/like", {
          commentId: commentId,
          accountId: accountId,
        });
        const getListCommentsStorage = localStorage.getItem("listLikeComments");
        if (result.data.message === "like") {
          if (getListCommentsStorage) {
            let convertToArray = JSON.parse(getListCommentsStorage);
            convertToArray.push(commentId);
            localStorage.setItem("listLikeComments", JSON.stringify(convertToArray));
          } else {
            const newListComments = [];
            newListComments.push(commentId);
            localStorage.setItem("listLikeComments", JSON.stringify(newListComments));
          }
        } else if (result.data.message === "unlike") {
          let convertToArray = JSON.parse(getListCommentsStorage);
          const filterArray = convertToArray.filter((item) => item !== commentId);
          localStorage.setItem("listLikeComments", JSON.stringify(filterArray));
        }

        const getComments = await axios.get("/api/source-code/comments/" + sourceCode[0]._id);
        setListComment(getComments.data.data.slice(0, 5));
        setListCommentAll(getComments.data.data);
        // setIsGetListComments(false);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    }
  };
  const checkLikedComment = (id) => {
    const getListCommentsStorage = localStorage.getItem("listLikeComments");
    let check = false;
    if (getListCommentsStorage) {
      JSON.parse(getListCommentsStorage).forEach((item) => {
        if (item === id) {
          check = true;
        }
      });
    }
    return check;
  };

  const handleClickLoadMoreComments = () => {
    setIsLoadMoreComments(true);
    setListComment(listCommentsAll);
  };
  return (
    <>
      {sourceCode.length > 0 && (
        <>
          <Head>
            <title>{`${sourceCode[0].title} - LT Blog`}</title>
            <meta name="description" content={sourceCode[0].desc} />
            <meta
              name="keywords"
              content={`Thinhle, Le Thinh, lethinh2003, huynhobe, blog, laptrinhvien, it, cntt, source code free, source, code, game freefire, code game freefire, vong quay freefire, javascript,  ${sourceCode[0].keywords.join(
                ", "
              )}`}
            />
            <meta property="og:title" content={`${sourceCode[0].title} - LT Blog`} />
            <meta property="og:description" content={sourceCode[0].desc} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={sourceCode[0].images[0]} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
          </Head>

          {isOpen && images.length > 0 && (
            <Lightbox
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              onCloseRequest={() => setIsOpen(false)}
              onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
              onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
            />
          )}

          <Layout>
            <Backdrop sx={{ color: "#fff", zIndex: 99999, backdropFilter: "blur(3px)" }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Email isEmailModal={isEmailModal} setIsEmailModal={setIsEmailModal} codeId={sourceCode[0]._id} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                bgcolor: "background.default",
                justifyContent: "center",
                color: "text.primary",
                gap: "10px",
                padding: "40px 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  bgcolor: "background.default",
                  justifyContent: "center",
                  color: "text.primary",
                  gap: "10px",
                  padding: "40px 0",
                }}
              >
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
                >
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link style={{ color: "inherit" }} href="/">
                      Home
                    </Link>
                    <Link style={{ color: "inherit" }} href="/source-code">
                      Sources
                    </Link>
                    <Typography color="text.primary">{sourceCode[0].title}</Typography>
                  </Breadcrumbs>
                  <h1 className="title">Trang thông tin code</h1>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "20px",
                      width: "100%",
                      padding: "20px",
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: "200px",
                        width: "200px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0px 5px 50px 0px #52f18a, 0px 0px 0px 7px rgb(31 195 127)",
                      }}
                      component="img"
                      image={sourceCode[0].images[0]}
                      alt="green iguana"
                    />
                    <CardContent
                      sx={{
                        borderRadius: "20px",
                        boxShadow: "0px 2px 7px 2px #1abd79",
                        border: "2px solid #17d289",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <AiFillFileZip /> Tên code: {sourceCode[0].title}{" "}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <AiOutlineEye /> Lượt xem: {sourceCode[0].views}{" "}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <FaMoneyCheckAlt /> Phí tải:{" "}
                        <NumberFormat
                          value={sourceCode[0].costs}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          suffix={" VNĐ"}
                        />
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <BsCloudDownload /> Lượt tải: {sourceCode[0].downloads}{" "}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <AiOutlineCalendar /> Thời gian: {convertToTime(sourceCode[0].createdAt)}{" "}
                      </Typography>
                    </CardContent>
                  </Box>
                </Box>

                {sourceCode.length > 0 &&
                  sourceCode.map((item, i) => {
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          bgcolor: "background.default",
                          justifyContent: "center",
                          color: "text.primary",
                          gap: "10px",
                          padding: { xs: "10px", md: "20px" },
                        }}
                      >
                        <h1 style={{ fontFamily: "Noto Sans" }}>{item.title}</h1>
                        {item.updatedAt && (
                          <Typography
                            sx={{
                              fontWeight: "500",
                            }}
                          >
                            <AiOutlineCalendar /> Cập nhật: {convertToTime(sourceCode[0].updatedAt)}{" "}
                          </Typography>
                        )}
                        <Typography component="div" sx={{ fontFamily: "Noto Sans" }}>
                          <div className="content-html" dangerouslySetInnerHTML={{ __html: item.content }} />
                        </Typography>

                        <Typography
                          component="div"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {status === "authenticated" ? (
                            <Button variant="outlined" onClick={() => handleClickOpenEmail()}>
                              Mua Code
                            </Button>
                          ) : (
                            <Button variant="outlined">Đăng Nhập Để Mua Code</Button>
                          )}

                          {item.images.length > 0 &&
                            item.images.map((im, i) => {
                              return (
                                <img
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
                      </Box>
                    );
                  })}
              </Box>

              <h1 className="title" ref={getPSComment} id="comments">
                Comments
              </h1>
              <Input
                disabled={status === "authenticated" ? false : true}
                value={comment}
                placeholder="Nhập bình luận"
                sx={{
                  width: "300px",
                }}
                onChange={(e) => handleChangeComment(e)}
                error={isComment && comment.length < 5 ? true : false}
              />
              {isComment && comment.length < 5 && (
                <Typography sx={{ color: "#f44336" }}>Comment phải trên 5 kí tự</Typography>
              )}
              {status !== "authenticated" && (
                <Typography sx={{ color: "#f44336" }}>Bạn phải đăng nhập để bình luận</Typography>
              )}
              {status === "authenticated" && (
                <Button variant="contained" disabled={comment.length < 5 ? true : false} onClick={handleClickComment}>
                  Bình luận
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: { xs: "0 10px", md: "0 40px" },
                }}
              >
                {isPostingComment && (
                  <CircularProgress
                    sx={{
                      alignSelf: "center",
                    }}
                  />
                )}
                {listComments.length === 0 && !isPostingComment && (
                  <Typography>Hãy là người đầu tiên bình luận</Typography>
                )}
                {listComments.length > 0 &&
                  listComments.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontFamily: "Noto Sans",
                      }}
                    >
                      <ListItem button={true}>
                        <ListItemAvatar>
                          <Avatar alt={item.account}>{item.account.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.account} secondary={item.content}></ListItemText>
                        <IconButton
                          size="large"
                          aria-label="show likes"
                          color="inherit"
                          onClick={
                            status === "authenticated" ? () => handleCLickLikeComment(item._id, session.user.id) : null
                          }
                        >
                          <Badge badgeContent={item.likes.length} color="error">
                            <ThumbUpAltIcon
                              sx={{
                                color: checkLikedComment(item._id) ? "#2d82d6" : "inherit",
                              }}
                            />
                          </Badge>
                        </IconButton>
                      </ListItem>
                      <Typography
                        button
                        sx={{
                          paddingLeft: "18px",
                          fontStyle: "italic",
                          fontSize: "12px",
                        }}
                      >
                        {convertToTime(item.createdAt)}
                      </Typography>
                    </Box>
                  ))}
              </Box>
              {listCommentsAll.length >= 5 && listComments.length > 0 && !isLoadMoreComments && (
                <Button variant="outlined" onClick={handleClickLoadMoreComments}>
                  Xem tất cả
                </Button>
              )}
              <h1 className="title" ref={getPSComment} id="comments">
                MYSELF
              </h1>
              <Card sx={{ display: "flex", padding: "20px 0px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "20px",
                    padding: { xs: "0 10px", md: "0 40px" },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ height: 100, width: 100, objectFit: "cover", borderRadius: "10px" }}
                    image="https://i.imgur.com/gL5yqrj.jpg"
                    alt="Live from space album cover"
                  />
                  <CardContent
                    sx={{
                      padding: "unset",
                    }}
                  >
                    <Typography sx={{ fontFamily: "Noto Sans", fontWeight: "bold" }} component="div" variant="div">
                      Lê Văn Thịnh
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Noto Sans",
                      }}
                      color="text.secondary"
                      component="div"
                    >
                      Tôi chỉ là một người đam mê lập trình web, chia sẻ những gì mình tích luỹ được, góp phần cộng đồng
                      lập trình người Việt
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <a href="https://www.facebook.com/thinhvle2210/" target="_blank" rel="noopener noreferrer">
                      <IconButton aria-label="fb">
                        <FacebookIcon />
                      </IconButton>
                    </a>
                    <a href="https://zalo.me/lethinhpro123" target="_blank" rel="noopener noreferrer">
                      <IconButton aria-label="zalo">
                        <SiZalo />
                      </IconButton>
                    </a>
                    <a href="https://www.instagram.com/thinhle2210/" target="_blank" rel="noopener noreferrer">
                      <IconButton aria-label="instagram">
                        <InstagramIcon />
                      </IconButton>
                    </a>
                  </Box>
                </Box>
              </Card>

              <h1 className="title" ref={getPSComment} id="comments">
                Tag
              </h1>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  fontSize: "35px",
                  padding: { xs: "0 10px", md: "0 40px" },
                }}
              >
                {sourceCode[0].keywords.join(", ")}
              </Box>
            </Box>
          </Layout>
        </>
      )}
    </>
  );
};
export default DetailSourceCode;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const test = params.slug.join("/");
  await dbConnect();
  let sourceBySlug = [];

  await Promise.all([Code.find({ slug: { $in: test } })])
    .then((data) => {
      sourceBySlug = data[0];
    })
    .catch((err) => console.log(err));
  return {
    props: {
      sourceBySlug: JSON.stringify(sourceBySlug),
    },
  };
};
