import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fab from "@mui/material/Fab";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";
import { styled } from "@mui/material/styles";

const BackToTop = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
  const ArrowButton = styled(KeyboardArrowUpIcon)({});
  const ArrowButtonParent = styled(Fab)({
    position: "fixed",
    backgroundColor: "#0cc5e3",

    bottom: "0",
    right: "0",
    width: 40,
    height: 40,
    borderRadius: "5px",

    "&:hover": {
      backgroundColor: "#0cc5e3",
      opacity: 0.8,
    },
  });
  return (
    <>
      <Zoom in={trigger}>
        <ArrowButtonParent
          sx={{
            margin: { xs: "10px", md: "20px" },
          }}
          onClick={scrollToTop}
        >
          <ArrowButton />
        </ArrowButtonParent>
      </Zoom>
    </>
  );
};
export default BackToTop;
