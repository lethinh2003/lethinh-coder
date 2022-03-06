import Layout from "../../../components/admin/Layout";
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
import Overview from "../../../components/admin/panel/Overview";
import HistoryCode from "../../../components/admin/panel/HistoryCode";
import Users from "../../../components/admin/panel/Users";
import Code from "../../../components/admin/panel/Code";
import Link from "next/link";
const SourceCode = () => {
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
          <Link href="/admin/source-code/new">
            <Button variant="contained">Tạo mới</Button>
          </Link>
          <Code />
        </Box>
      </Layout>
    </>
  );
};
export default SourceCode;
