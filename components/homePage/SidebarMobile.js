import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SourceIcon from "@mui/icons-material/Source";
import { Box, Button, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";

const SidebarMobile = (props) => {
  const { session, status, handleClickSidebarMobile, isSidebarMobile } = props;
  const theme = useTheme();
  const router = useRouter();
  const menuWrapper = useRef();
  const handleClickOutSide = (e) => {
    if (!menuWrapper.current.contains(e.target)) {
      handleClickSidebarMobile();
    }
  };
  const handleClickOpenLoginMiddle = () => {
    handleClickSidebarMobile();
  };
  const handleClickOpenSignupMiddle = () => {
    handleClickSidebarMobile();
  };

  return (
    <>
      <Box
        onClick={(e) => handleClickOutSide(e)}
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
            ref={menuWrapper}
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
              <Link href="/">
                <Button
                  onClick={handleClickSidebarMobile}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "5px",
                    fontSize: "25px",
                    fontWeight: "bold",
                    padding: "5px",
                    textTransform: "capitalize",
                    fontWeight: 500,
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
                    Home
                  </div>
                </Button>
              </Link>
              {status !== "authenticated" && (
                <>
                  <Link href="/login">
                    <Button
                      onClick={handleClickOpenLoginMiddle}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "5px",
                        fontSize: "25px",
                        fontWeight: "bold",
                        padding: "5px",
                        textTransform: "capitalize",
                        fontWeight: 500,
                      }}
                      component="div"
                    >
                      <AiOutlineLogin style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                      <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                        Login
                      </Typography>
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      onClick={handleClickOpenSignupMiddle}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "5px",
                        fontSize: "25px",
                        fontWeight: "bold",
                        padding: "5px",
                        textTransform: "capitalize",
                        fontWeight: 500,
                      }}
                      component="div"
                    >
                      <AiOutlineLogin style={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                      <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                        Sign up
                      </Typography>
                    </Button>
                  </Link>
                </>
              )}

              <Link href="/source-code">
                <Button
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "5px",
                    fontSize: "25px",
                    fontWeight: "bold",
                    padding: "5px",
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                  component="div"
                >
                  <SourceIcon sx={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                  <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                    Source
                  </Typography>
                </Button>
              </Link>
              {session && session.user.role === "admin" && (
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
                      textTransform: "capitalize",
                      fontWeight: 500,
                    }}
                    component="div"
                  >
                    <AdminPanelSettingsIcon sx={{ fontSize: "20px", fontWeight: "inherit", width: "30px" }} />
                    <Typography sx={{ fontSize: "20px", fontWeight: "inherit" }} component="span">
                      Admin
                    </Typography>
                  </Button>
                </Link>
              )}
            </Box>
          </Box>
        </Slide>
      </Box>
    </>
  );
};
export default SidebarMobile;
