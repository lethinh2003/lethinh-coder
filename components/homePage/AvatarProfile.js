import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
const AvatarComponent = styled(Avatar)({
  borderRadius: "10px",
});
const MenuAvatarComponent = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "15px",
    backgroundColor: theme.palette.mode === "light" ? "#f5f8fc" : "#1c1f26",
    border: "1px solid #a4a6a9",
  },
}));
const MenuAvatarItemComponent = styled(MenuItem)(({ theme }) => ({
  "&.MuiMenuItem-root": {
    "&:hover": {
      backgroundColor: theme.palette.mode === "light" ? "#e1e5e9" : "#2d313a",
      borderRadius: "10px",
    },
  },
  "&.MuiMenuItem-root .MuiTypography-root": {
    fontSize: "1.5rem",
    color: theme.palette.mode === "light" ? "#515254" : "#a8b3cf",
  },
}));
const MenuItemComponent = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  justifyContent: "space-between",
});
const AvatarProfile = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuUser = Boolean(anchorEl);

  const handleClickLogout = async () => {
    const data = await signOut({
      redirect: true,
      callbackUrl: "/",
    });
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
      {session && session.user && (
        <>
          <IconButton onClick={(e) => handleOpenUserMenu(e)}>
            <AvatarComponent
              sx={{
                backgroundColor: (theme) => theme.palette.avatar.default,
              }}
              alt={session.user.name}
              src={session.user.avatar}
            >
              {session.user.name.charAt(0)}
            </AvatarComponent>
          </IconButton>

          <MenuAvatarComponent
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
            <MenuAvatarItemComponent>
              <Link href={"/users/" + session.user.account} onClick={handleCloseUserMenu}>
                <MenuItemComponent>
                  <PersonIcon
                    sx={{
                      width: "30px",
                    }}
                  />
                  <Typography
                    sx={{
                      flex: "1",
                    }}
                  >
                    Profile
                  </Typography>
                </MenuItemComponent>
              </Link>
            </MenuAvatarItemComponent>
            <MenuAvatarItemComponent>
              <MenuItemComponent onClick={handleClickLogoutMiddle}>
                <MeetingRoomIcon
                  sx={{
                    width: "30px",
                  }}
                />
                <Typography
                  sx={{
                    flex: "1",
                  }}
                >
                  Logout
                </Typography>
              </MenuItemComponent>
            </MenuAvatarItemComponent>
          </MenuAvatarComponent>
        </>
      )}
    </>
  );
};
export default AvatarProfile;
