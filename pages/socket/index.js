import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import io from "socket.io-client";
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
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Input,
  Skeleton,
  FormControl,
  TextField,
} from "@mui/material";
let socket;

const Home = () => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => socketInitializer(), []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.emit("get-all-users");
    socket.on("get-all-users", (data) => {
      setUsers(data);
    });
    socket.on("user-join-error", (msg) => {
      alert(msg);
    });
    socket.on("user-join-success", (data) => {
      setUsers(data);
    });
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleClickSubmit = () => {
    socket.emit("user-join", name);
  };

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
            padding: "40px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { xs: "10px", md: "20px" },
            }}
          >
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => handleChangeName(e)}
              />
              <Typography sx={{ marginTop: 2 }}>
                <Button onClick={() => handleClickSubmit()} variant="outlined">
                  Submit
                </Button>
              </Typography>
              {users.length > 0 && users.map((item, i) => <h3 key={i}>{item}</h3>)}
            </Box>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default Home;
