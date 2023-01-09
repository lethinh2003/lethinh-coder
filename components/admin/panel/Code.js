import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import convertToTime from "../../../utils/convertTime";
import ModalDeleteCode from "./ModalDeleteCode";
const Code = () => {
  const [historyCode, setHistoryCode] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [isModalInfo, setIsModalInfo] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idDelete, setIDDelete] = useState(null);
  const [dataDelete, setDataDelete] = useState(null);
  const callDataApi = async () => {
    const results = await axios.get(`${process.env.ENDPOINT_SERVER}/api/v1/admin/source-codes`);

    return results.data;
  };
  const getListQuery = useQuery("get-admin-source-codes", callDataApi, {
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
        action: item._id,
        stt: i + 1,
        title: item.title,
        costs: item.costs,
        views: item.views,
        downloads: item.downloads,
        time: convertToTime(item.createdAt),
        link: item.link,
        status: item.status,
      }));
      setHistoryCode(newData);
    }
  }, [dataQuery]);

  useEffect(() => {
    if (idDelete) {
      const getCurrentList = [...historyCode];
      const newList = getCurrentList.filter((item, i) => item.id !== idDelete);
      setHistoryCode(newList);
    }
  }, [idDelete]);

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
    {
      field: "costs",
      headerName: "Giá",
      width: 200,
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType={"text"}
          thousandSeparator={"."}
          decimalSeparator={","}
          suffix={" VNĐ"}
        />
      ),
    },
    {
      field: "link",
      headerName: "Link",
      width: 200,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          <Button variant="contained" color="primary" size="small" style={{ marginLeft: 16 }}>
            Truy cập
          </Button>
        </a>
      ),
    },
    { field: "time", headerName: "Thời gian", width: 250 },
    { field: "views", headerName: "Views", width: 100 },
    { field: "status", headerName: "Status", type: "boolean", width: 100 },
    { field: "downloads", headerName: "Downloads", width: 100 },
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
        <Link href={`/admin/source-code/${params.id}`} label="Info">
          <InfoIcon />
        </Link>,
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Source Code - Trang quản trị Admin</title>
      </Head>

      {isModalDelete && (
        <ModalDeleteCode
          setIDDelete={setIDDelete}
          isModal={isModalDelete}
          setIsModal={setIsModalDelete}
          dataDelete={dataDelete}
          setDataDelete={setDataDelete}
        ></ModalDeleteCode>
      )}
      <Typography
        component="h1"
        className="title"
        sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
      >
        Source Code
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
export default Code;
