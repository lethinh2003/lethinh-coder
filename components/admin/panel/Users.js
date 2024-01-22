import { Box, Skeleton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useGetUsers from "../../../hooks/admin/useGetUsers";
import convertToTime from "../../../utils/convertTime";
const Users = () => {
  const [users, setUsers] = useState([]);

  const { data: dataQuery, isLoading, isFetching, isError: isErrorQuery, error } = useGetUsers();

  useEffect(() => {
    if (dataQuery && dataQuery.length > 0) {
      const newData = dataQuery.map((item, i) => ({
        id: item._id,
        stt: i + 1,
        account: item.account,
        name: item.name,
        time: convertToTime(item.createdAt),
        role: item.role,
        status: item.status,
      }));
      setUsers(newData);
    }
  }, [dataQuery]);

  const GridRowsProp = users;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "account", headerName: "Account", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "id", headerName: "ID", width: 270 },
    { field: "time", headerName: "Tham gia", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "status", headerName: "Status", type: "boolean", width: 150 },
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
              <Box key={i} sx={{ marginTop: "10px" }}>
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
