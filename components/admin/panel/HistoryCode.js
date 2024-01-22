import { Box, Skeleton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useGetHistoryDownloadCode from "../../../hooks/admin/useGetHistoryDownloadCode";
import convertTime from "../../../utils/convertTime";

const HistoryCode = () => {
  const [historyCode, setHistoryCode] = useState([]);

  const { data: dataQuery, isLoading, isFetching, isError: isErrorQuery, error } = useGetHistoryDownloadCode();

  useEffect(() => {
    if (dataQuery && dataQuery.length > 0) {
      const newData = dataQuery.map((item, i) => ({
        id: item._id,
        stt: i + 1,
        account: item.account,
        email: item.email,
        content: item.content,
        status: item.status,
        time: convertTime(item.createdAt),
        ip: item.ipAddress,
      }));
      setHistoryCode(newData);
    }
  }, [dataQuery]);

  const GridRowsProp = historyCode;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "account", headerName: "Account", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "content", headerName: "Content", minWidth: 600, maxWidth: 2000 },
    { field: "time", headerName: "Time", width: 250 },
    { field: "ip", headerName: "IP", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
  ];

  return (
    <>
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        History Download Code
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
export default HistoryCode;
