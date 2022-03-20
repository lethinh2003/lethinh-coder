import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const AvatarProfile = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const getAvatar = useSelector((state) => state.getAvatar);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState("");
  const isMenuUser = Boolean(anchorEl);

  useEffect(() => {
    if (status === "authenticated") {
      if (getAvatar === "") {
        const geta = localStorage.getItem("avatarProfile");
        if (geta) {
          setAvatar(geta);
        } else {
          localStorage.setItem("avatarProfile", session.user.avatar);
          setAvatar(session.user.avatar);
        }
      } else {
        const geta = localStorage.getItem("avatarProfile");
        setAvatar(geta);
      }
    }
  }, [getAvatar, status]);
  const handleClickLogout = async () => {
    const data = await signOut({
      redirect: false,
    });
    localStorage.removeItem("listLikeComments");
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClickLogoutMiddle = () => {
    handleClickLogout();
    handleCloseUserMenu();
  };

  return (
    <>
      {status === "authenticated" && (
        <>
          <IconButton onClick={(e) => handleOpenUserMenu(e)}>
            <Avatar alt={session.user.name} src={avatar}>
              {session.user.name.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuUser}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Link href={"/users/" + session.user.account}>
                <Typography textAlign="center">Profile</Typography>
              </Link>
            </MenuItem>
            <MenuItem>
              <Typography textAlign="center" onClick={handleClickLogoutMiddle}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};
export default AvatarProfile;
