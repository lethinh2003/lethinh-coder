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
import ModalInfoBlog from "./ModalInfoBlog";
import ModalDeleteBlog from "./ModalDeleteBlog";
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
        const results = await axios.get("/api/admin/blog");
        const data = results.data.data;
        setIsLoading(false);
        if (data.length > 0) {
          const newData = data.map((item, i) => ({
            id: item._id,
            action: item._id,
            stt: i + 1,
            title: item.title,
            readTime: item.readTime,
            views: item.views,

            time: convertToTime(item.createdAt),
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
      field: "readTime",
      headerName: "Readtime",
      width: 200,
    },

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
        <ModalInfoBlog
          title={"Thông tin Blog"}
          isModal={isModalInfo}
          setIsModal={setIsModalInfo}
          id={id}
          setId={setId}
        ></ModalInfoBlog>
      )}
      {isModalDelete && (
        <ModalDeleteBlog
          title={"Xoá Blog"}
          isModal={isModalDelete}
          setIsModal={setIsModalDelete}
          id={id}
          setId={setId}
        ></ModalDeleteBlog>
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
export default Code;
