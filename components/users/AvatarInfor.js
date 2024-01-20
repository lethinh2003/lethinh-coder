import { Avatar, Box, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";

const AvatarPersonal = styled(Avatar)({
  width: "100px",
  height: "100px",
  fontSize: "4rem",
  position: "relative",

  "&::before": {
    content: `""`,
    position: "absolute",
  },
});

const AvatarInfor = ({ user, isLoading }) => {
  return (
    <>
      {isLoading && <Skeleton variant="circular" width={150} height={150} />}

      {!isLoading && user && (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.dialog.bgColor.default,
            borderRadius: "20px",
            padding: "10px",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <AvatarPersonal
            sx={{
              borderRadius: "10px",
              backgroundColor: (theme) => theme.palette.avatar.default,
            }}
            alt={user.name}
            src={user.avatar}
          >
            {user.name.charAt(0)}
          </AvatarPersonal>
        </Box>
      )}
    </>
  );
};
export default AvatarInfor;
