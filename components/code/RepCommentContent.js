import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import React, { useState, memo } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const RepCommentContent = (props) => {
  const { replyComment, setReplyComment, session } = props;
  console.log("re-render");
  const BoxComment = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    fontFamily: "Noto Sans",

    marginBottom: "10px",

    borderRadius: "10px",
    padding: "5px 0px",
    border: `1px solid ${theme.palette.card.borderColor.default}`,
    backgroundColor: theme.palette.card.bgColor.default,

    "&:hover": {
      border: `1px solid ${theme.palette.card.borderColor.hover}`,
    },
  }));

  const handleClickCancelReply = () => {
    setReplyComment(null);
  };

  return (
    <>
      <BoxComment as={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
        <ListItem button={false}>
          <ListItemAvatar>
            <Avatar
              sx={{
                backgroundColor: (theme) => theme.palette.avatar.default,
                borderRadius: "10px",
              }}
              alt={replyComment.user[0].name}
              src={replyComment.user[0].avatar}
            >
              {replyComment.user[0].name.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                {replyComment.user[0].name} - {replyComment.user[0].role === "admin" ? "Admin" : "Member"}
              </Typography>
            }
            secondary={replyComment.content.split("\n").map((itemm, i) => (
              <Typography key={i}>{itemm}</Typography>
            ))}
          ></ListItemText>
        </ListItem>
      </BoxComment>
      <Typography
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          padding: "5px",
          border: "1px solid",
          borderRadius: "10px",
          width: "30px",
          height: "30px",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.6rem",
          cursor: "pointer",
        }}
        onClick={() => handleClickCancelReply()}
      >
        ❌
      </Typography>
    </>
  );
};
export default memo(RepCommentContent);
