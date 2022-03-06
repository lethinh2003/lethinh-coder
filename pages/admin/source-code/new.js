import React, { useState, useEffect, useRef } from "react";
import validator from "validator";
import axios from "axios";
import Layout from "../../../components/admin/Layout";
import {
  Button,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Backdrop,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import Modal from "../../../components/homePage/Modal";
export default function MyEditor() {
  const editorRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState("");
  const [costs, setCosts] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("../../../ckeditor5-build-with-htmlembed-master"),
    };
    setEditorLoaded(true);
  }, []);
  const handleClickSend = async () => {
    try {
      setIsLoading(true);
      const data = localStorage.getItem("postData") || null;
      const imagesArray = images.split(", ");

      const response = await axios.post("/api/source-code", {
        title: title,
        content: data,
        link: link,
        costs: costs,
        images: imagesArray,
        desc: desc,
      });
      setIsModal(true);
      setText(response.data.message);
      setTitle("");
      setLink("");
      setDesc("");
      setCosts(0);
      setImages("");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
  };
  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };
  const handleChangeCosts = (e) => {
    setCosts(e.target.value);
  };
  const handleChangeImages = (e) => {
    setImages(e.target.value);
  };
  const upload = async (e) => {
    // Convert the FileList into an array and iterate
    let files = Array.from(e.target.files).map((file) => file);

    // At this point you'll have an array of results

    console.log(files);
  };

  return (
    <>
      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Modal title={"Tin từ hệ thống"} isModal={isModal} setIsModal={setIsModal}>
          <DialogContentText>{text}</DialogContentText>
        </Modal>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: "40px 20px",
          }}
        >
          <Typography
            component="h1"
            className="title"
            sx={{ fontFamily: "Bebas Neue", fontSize: "40px", fontWeight: "bold" }}
          >
            New Source Code
          </Typography>
          {!editorLoaded && <div>Editor loading</div>}
          {editorLoaded && (
            <>
              <TextField
                id="title"
                label="Title"
                variant="outlined"
                value={title}
                fullWidth
                onChange={(e) => handleChangeTitle(e)}
              />
              <TextField
                id="desc"
                label="Desc"
                variant="outlined"
                fullWidth
                value={desc}
                onChange={(e) => handleChangeDesc(e)}
              />
              <TextField
                id="link"
                label="Link"
                variant="outlined"
                fullWidth
                value={link}
                onChange={(e) => handleChangeLink(e)}
              />
              <TextField
                fullWidth
                id="costs"
                label="Costs"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={costs}
                onChange={(e) => handleChangeCosts(e)}
              />
              <TextField
                fullWidth
                id="images"
                label="Images"
                variant="outlined"
                value={images}
                onChange={(e) => handleChangeImages(e)}
              />
              {/* <input type="file" onChange={upload} multiple /> */}

              <Box sx={{ width: "100%", color: "black" }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={localStorage.getItem("postData") || null}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    localStorage.setItem("postData", data);
                  }}
                />
              </Box>
              <Button variant="outlined" onClick={() => handleClickSend()}>
                Send
              </Button>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
}
