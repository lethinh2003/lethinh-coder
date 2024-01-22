import SourceIcon from "@mui/icons-material/Source";
import { Box, Button, Fade, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { useOnClickOutside } from "usehooks-ts";
const SidebarMobile = ({ handleClickSidebarMobile, isSidebarMobile }) => {
  const theme = useTheme();
  const router = useRouter();
  const ref = useRef();
  useOnClickOutside(ref, handleClickSidebarMobile);
  return (
    <>
      <Fade in={isSidebarMobile}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,.5)",
            zIndex: 1001,
          }}
        >
          <Slide direction="right" in={isSidebarMobile} mountOnEnter unmountOnExit>
            <Box
              ref={ref}
              sx={{
                position: "absolute",
                backgroundColor: "sidebarMobile.background.default",
                height: "100vh",
                width: "300px",
                padding: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Link href="/admin">
                  <Button
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                    className={router.pathname === "/" ? `active_${theme.palette.mode}` : "thinhs"}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <FaHome style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: "20px",
                      }}
                    >
                      Overview
                    </div>
                  </Button>
                </Link>

                <Link href="/admin/blog">
                  <Button
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                  >
                    <CgProfile style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Blog
                    </Typography>
                  </Button>
                </Link>
                <Link href="/admin/source-code">
                  <Button
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                    component="div"
                  >
                    <SourceIcon sx={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Source
                    </Typography>
                  </Button>
                </Link>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </>
  );
};
export default SidebarMobile;
