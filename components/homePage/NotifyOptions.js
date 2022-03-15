import { Menu, MenuItem, Typography } from "@mui/material";
let socket;
const NotifyOptions = (props) => {
  const { anchorEl, isMenuUser, handleCloseUserMenu, notifyId } = props;
  console.log(notifyId);
  return (
    <>
      <Menu
        className="thinhlee"
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
          <Typography textAlign="center">{notifyId}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default NotifyOptions;
