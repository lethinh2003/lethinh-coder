import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Skeleton,
} from "@mui/material";
import convertTime from "../../utils/convertTime";
import axios from "axios";
const Info = (props) => {
  const { data, isLoading } = props;

  return (
    <>
      <Card
        sx={{
          minHeight: "340px",
          width: "100%",
          borderRadius: "20px",
          padding: "20px",
          gap: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
        }}
      >
        {isLoading && <Skeleton variant="circular" width={150} height={150} />}
        {!isLoading && data.length > 0 && (
          <Avatar
            sx={{
              width: "150px",
              height: "150px",
              fontSize: "40px",
            }}
          >
            {data[0].account.charAt(0)}
          </Avatar>
        )}
        <Box
          sx={{
            flex: "1 1",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isLoading && (
            <>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={150} />
            </>
          )}
          {!isLoading && data.length > 0 && (
            <>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                Profile
              </Typography>
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                {data[0].account}
              </Typography>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Noto Sans",
                }}
              >
                Tham gia: {convertTime(data[0].createdAt)}
              </Typography>
            </>
          )}
        </Box>
      </Card>
    </>
  );
};
export default Info;
