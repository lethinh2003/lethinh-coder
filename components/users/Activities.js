import { Box, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Comments from "./Comments";
import RepComments from "./RepComments";

const Activities = ({ user, socket }) => {
  return (
    <>
      <Box
        sx={{
          paddingTop: "16px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Comments user={user} socket={socket} />
          <RepComments user={user} socket={socket} />
        </Box>
      </Box>
    </>
  );
};

export default Activities;
