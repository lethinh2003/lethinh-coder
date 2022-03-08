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
const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const results = await axios.get("/api/admin/users");
        const data = results.data.data;
        setIsLoading(false);
        if (data.length > 0) {
          const newData = data.map((item, i) => ({
            id: item._id,
            stt: i + 1,
            account: item.account,
            time: convertToTime(item.createdAt),
            role: item.role,
            status: item.status,
          }));
          setUsers(newData);
        }
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    };

    getUsers();
  }, []);
  const convertToTime = (timeISOString) => {
    let date = `Gần đây`;
    const getFullDate = new Date(timeISOString);
    const getDay = `${getFullDate.getDate() < 10 ? "0" + getFullDate.getDate() : getFullDate.getDate()}/${
      getFullDate.getMonth() < 9 ? "0" + (getFullDate.getMonth() + 1) : getFullDate.getMonth() + 1
    }/${getFullDate.getFullYear()}`;
    const getTime = `${getFullDate.getHours() < 10 ? "0" + getFullDate.getHours() : getFullDate.getHours()}:${
      getFullDate.getMinutes() < 10 ? "0" + getFullDate.getMinutes() : getFullDate.getMinutes()
    }:${getFullDate.getSeconds() < 10 ? "0" + getFullDate.getSeconds() : getFullDate.getSeconds()}`;
    date = getDay + " " + getTime;
    return date;
  };
  const GridRowsProp = users;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "account", headerName: "Account", width: 200 },
    { field: "time", headerName: "Tham gia", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  return (
    <>
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        Users
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
export default Users;
