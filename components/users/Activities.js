import { Box } from "@mui/material";
import Head from "next/head";
import Comments from "./Comments";
const Activities = ({ user, socket }) => {
  return (
    <>
      <Head>
        <title>Hoạt động tài khoản {user.account}</title>
      </Head>
      <Box
        sx={{
          paddingTop: "16px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Comments user={user} socket={socket} />
        </Box>
      </Box>
    </>
  );
};

export default Activities;
