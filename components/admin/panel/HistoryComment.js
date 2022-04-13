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
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import convertToTime from "../../../utils/convertTime";
const HistoryComment = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const results = await axios.get("/api/admin/history-comment");
        const data = results.data.data;
        setIsLoading(false);
        if (data.length > 0) {
          const newData = data.map((item, i) => ({
            id: item._id,
            stt: i + 1,
            account: item.user[0].account,
            time: convertToTime(item.createdAt),
            content: item.content,
            code: item.code[0] ? item.code[0]._id : item.blog[0]._id,
            likes: item.likes.length,
          }));
          setHistory(newData);
        }
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    };

    getUsers();
  }, []);

  const GridRowsProp = history;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "account", headerName: "Account", width: 200 },
    { field: "content", headerName: "Content", minWidth: 250, maxWidth: 1050 },
    { field: "time", headerName: "Time", width: 250 },
    { field: "likes", headerName: "Likes", width: 150 },
    { field: "code", headerName: "Box ID", width: 250 },
  ];

  return (
    <>
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        History Comment
      </Typography>
      <div style={{ height: 500, width: "100%" }}>
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((item, i) => (
              <Box sx={{ marginTop: "10px" }}>
                <Skeleton variant="rectangular" height={50} />
              </Box>
            ))}
          </>
        )}
        {!isLoading && <DataGrid rows={GridRowsProp} columns={GridColDef} />}
      </div>
    </>
  );
};
export default HistoryComment;
