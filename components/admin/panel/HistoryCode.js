import { Box, Skeleton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import convertTime from "../../../utils/convertTime";
import { useQuery } from "react-query";

const HistoryCode = () => {
  const [historyCode, setHistoryCode] = useState([]);

  const callDataApi = async () => {
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/history-download-code`);

    return results.data;
  };
  const getListQuery = useQuery("get-admin-history-download-code", callDataApi, {
    cacheTime: Infinity, //Thời gian cache data, ví dụ: 5000, sau 5s thì cache sẽ bị xóa, khi đó data trong cache sẽ là undefined
    refetchOnWindowFocus: false,
  });
  const { data: dataQuery, isLoading, isFetching, isError: isErrorQuery, error } = getListQuery;
  useEffect(() => {
    if (error && error.response) {
      toast.error(error.response.data.message);
    }
  }, [isErrorQuery]);
  useEffect(() => {
    if (dataQuery && dataQuery.data.length > 0) {
      const newData = dataQuery.data.map((item, i) => ({
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
  useEffect(() => {
    const getHistoryCode = async () => {
      try {
        const results = await axios.get("/api/admin/history-code");
        const data = results.data.data;
        setIsLoading(false);
        if (data.length > 0) {
          const newData = data.map((item, i) => ({
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
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    };

    // getHistoryCode();
  }, []);

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
