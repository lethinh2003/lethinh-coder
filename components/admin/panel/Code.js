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
  DialogContentText,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import ModalInfoCode from "./ModalInfoCode";
import ModalDeleteCode from "./ModalDeleteCode";
import convertToTime from "../../../utils/convertTime";

const Code = () => {
  const [historyCode, setHistoryCode] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalInfo, setIsModalInfo] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [id, setId] = useState("");
  useEffect(() => {
    const getHistoryCode = async () => {
      try {
        const results = await axios.get("/api/admin/source-code");
        const data = results.data.data;
        setIsLoading(false);
        if (data.length > 0) {
          const newData = data.map((item, i) => ({
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
      } catch (err) {
        setIsLoading(false);

        console.log(err);
      }
    };

    getHistoryCode();
  }, []);

  const handleClickDelete = (id) => {
    setId(id);
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
        <NumberFormat
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
          onClick={() => handleClickDelete(params.id)}
          label="Delete"
        />,
        <GridActionsCellItem
          key={params.id}
          icon={<InfoIcon />}
          onClick={() => handleClickInfo(params.id)}
          label="Info"
        />,
      ],
    },
  ];
  const handleClickInfo = (id) => {
    setId(id);
    setIsModalInfo(true);
  };

  return (
    <>
      {isModalInfo && (
        <ModalInfoCode
          title={"Thông tin code"}
          isModal={isModalInfo}
          setIsModal={setIsModalInfo}
          id={id}
          setId={setId}
        ></ModalInfoCode>
      )}
      {isModalDelete && (
        <ModalDeleteCode
          title={"Xoá code"}
          isModal={isModalDelete}
          setIsModal={setIsModalDelete}
          id={id}
          setId={setId}
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
        {isLoading && <Skeleton variant="rectangular" height={200} />}
        {!isLoading && <DataGrid rows={GridRowsProp} columns={GridColDef} />}
      </div>
    </>
  );
};
export default Code;
