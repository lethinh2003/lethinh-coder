import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Skeleton, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGetBlogs from "../../../hooks/admin/useGetBlogs";
import convertToTime from "../../../utils/convertTime";
import ModalDeleteBlog from "./ModalDeleteBlog";
const Blog = () => {
  const [historyCode, setHistoryCode] = useState([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState(null);

  const { data: dataQuery, isLoading, isFetching, isError: isErrorQuery, error } = useGetBlogs();

  useEffect(() => {
    if (dataQuery && dataQuery.length >= 0) {
      const newData = dataQuery.map((item, i) => ({
        id: item._id,
        action: item._id,
        stt: i + 1,
        title: item.title,
        views: item.views,

        time: convertToTime(item.createdAt),
        status: item.status,
      }));
      setHistoryCode(newData);
    }
  }, [dataQuery]);

  const handleClickDelete = (data) => {
    setDataDelete({
      id: data.row.id,
      title: data.row.title,
    });
    setIsModalDelete(true);
  };
  const GridRowsProp = historyCode;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "title", headerName: "Title", minWidth: 400, maxWidth: 2000 },

    { field: "time", headerName: "Thời gian", width: 250 },
    { field: "views", headerName: "Views", width: 100 },
    { field: "status", headerName: "Status", type: "boolean", width: 100 },

    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id}
          icon={<DeleteIcon />}
          onClick={() => handleClickDelete(params)}
          label="Delete"
        />,
        <Link href={`/admin/blog/${params.id}`} label="Info">
          <InfoIcon />
        </Link>,
      ],
    },
  ];

  return (
    <>
      {isModalDelete && (
        <ModalDeleteBlog
          isModal={isModalDelete}
          setIsModal={setIsModalDelete}
          dataDelete={dataDelete}
          setDataDelete={setDataDelete}
        />
      )}
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        Blog
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
export default Blog;
