import { useEffect, useRef, useState } from "react";

const useCkeditor = () => {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../ckeditor5/build/ckeditor"),
    };
    setEditorLoaded(true);
  }, []);

  return { CKEditor, ClassicEditor, editorLoaded };
};
export default useCkeditor;
