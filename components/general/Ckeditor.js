import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import useCkeditor from "../../hooks/useCkeditor";

const Ckeditor = ({ content, setContent, setIsLoadingUploadImage }) => {
  const { editorLoaded, CKEditor, ClassicEditor } = useCkeditor();
  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);
            setIsLoadingUploadImage(true);

            fetch(`${process.env.NEXTAUTH_URL}/api/v1/admin/upload-file`, {
              method: "post",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                setIsLoadingUploadImage(false);
                resolve({
                  default: res.data,
                });
              })
              .catch((err) => {
                if (err.response) {
                  setIsLoadingUploadImage(false);
                  toast.error(err.response.data.message);
                }

                reject(err);
              });
          });
        });
      },
    };
  };
  const uploadPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  };
  return (
    <>
      {!editorLoaded && <Typography>Editor loading</Typography>}
      {editorLoaded && (
        <Box sx={{ width: "100%", color: "black", pt: 2, fontSize: "2rem" }}>
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            data={content}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </Box>
      )}
    </>
  );
};
export default Ckeditor;
