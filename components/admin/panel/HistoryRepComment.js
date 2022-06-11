import { Box, Skeleton, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import convertToTime from "../../../utils/convertTime";
import { useQuery } from "react-query";
import Link from "next/link";

const HistoryRepComment = () => {
  const [history, setHistory] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const callDataApi = async () => {
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/history-rep-comments`);

    return results.data;
  };
  const getListQuery = useQuery("get-admin-history-rep-comments", callDataApi, {
    cacheTime: Infinity,
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
        account: item.user[0].account,
        time: convertToTime(item.createdAt),
        content: item.content,
        comment: item.comment[0].content,
        title: item.comment[0].code[0] ? item.comment[0].code[0].title : item.comment[0].blog[0].title,
        link: item.comment[0].code[0]
          ? `/source-code/${item.comment[0].code[0].slug}`
          : `/blog/${item.comment[0].blog[0].slug}`,
      }));
      setHistory(newData);
    }
  }, [dataQuery]);

  const GridRowsProp = history;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "account", headerName: "Account", width: 200 },
    { field: "content", headerName: "Content", minWidth: 250, maxWidth: 1050 },
    { field: "time", headerName: "Time", width: 250 },
    { field: "comment", headerName: "Comment", width: 350 },
    {
      field: "title",
      headerName: "Title",
      width: 350,
    },
    {
      field: "link",
      headerName: "Link",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <Link href={cellValues.value}>
            <Button>Link</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        History Rep Comment
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
export default HistoryRepComment;
