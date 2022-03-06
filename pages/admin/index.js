import Layout from "../../components/admin/Layout";
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
} from "@mui/material";
import { HiTemplate } from "react-icons/hi";
import { AiOutlineCheck, AiFillFileZip } from "react-icons/ai";
import { MdPendingActions } from "react-icons/md";
import NumberFormat from "react-number-format";
import Overview from "../../components/admin/panel/Overview";
import HistoryCode from "../../components/admin/panel/HistoryCode";
import Users from "../../components/admin/panel/Users";
import HistoryComment from "../../components/admin/panel/HistoryComment";
const Admin = () => {
  return (
    <>
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "40px 10px", md: "40px 20px" },
          }}
        >
          <Overview />
          <HistoryCode />
          <Users />
          <HistoryComment />
        </Box>
      </Layout>
    </>
  );
};
export default Admin;
