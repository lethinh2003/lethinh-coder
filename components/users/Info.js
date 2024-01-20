import { Box, Skeleton, Typography } from "@mui/material";
import useGetInformationUser from "../../hooks/useGetInformationUser";
import { convertTimeAgo } from "../../utils/convertTime";
import AvatarInfor from "./AvatarInfor";
const Info = ({ account }) => {
  const {
    data: user,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
  } = useGetInformationUser({
    account,
  });

  return (
    <>
      <Box
        sx={{
          minHeight: "200px",
          width: "100%",

          padding: { xs: "0px 10px", md: "0px 20px" },
          gap: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
        }}
      >
        <AvatarInfor user={user} isLoading={isLoading} />
        <Box
          sx={{
            flex: "1 1",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Noto Sans",
          }}
        >
          {isLoading && (
            <>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={150} height={10} />
              <Skeleton variant="text" width={150} height={10} />
            </>
          )}
          {!isLoading && user && (
            <>
              <Typography
                sx={{
                  fontSize: "3rem",
                  fontWeight: "700",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "500",
                  color: (theme) => theme.palette.iconColor.default,
                }}
              >
                @{user.account}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: "500",
                }}
              >
                Tham gia {convertTimeAgo(user.createdAt)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
export default Info;
