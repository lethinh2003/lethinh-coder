import CKEditor from "@ckeditor/ckeditor5-react";
import Editor from "../ckeditor5-build-with-htmlembed-master";

const WYSIWYGCKEditor = () => {
  return (
    <div className="custom-ckeditor-editable">
      <CKEditor
        editor={Editor}
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
    </div>
  );
};

export default WYSIWYGCKEditor;
