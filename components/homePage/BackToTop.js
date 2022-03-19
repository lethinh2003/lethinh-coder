import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fab from "@mui/material/Fab";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";

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
  return (
    <>
      <Zoom in={trigger}>
        <Fab
          color="success"
          sx={{
            position: "fixed",

            borderRadius: "50%",
            margin: "10px",
            bottom: "0",
            right: "0",
          }}
          onClick={scrollToTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  );
};
export default BackToTop;
