import React, { useEffect, useRef, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import verifyToken from "../helpers/verifyToken";
import JoditEditor from "jodit-react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TextEditor from "./TextEditor.jsx";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import {
  Grid,
  TextField,
  Container,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Axios from "axios";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import UploadAdapter from "../helpers/uploadAdapter";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50px",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  text: {
    marginLeft: "10px",
  },
  editor: {
    overflowY: "scroll",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function UploadAdapterPlugin( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      // Configure the URL to the upload script in your back-end here!
      return new UploadAdapter( loader );
  };
}

const AddNews = (props) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const editor = useRef(null);
  const ckEditor = null;
  const [content, setContent] = React.useState("");

  const config = {
    // all options from https://xdsoft.net/jodit/doc/
    // askBeforePasteHTML: false,
    askBeforePasteFromWord: false, //couse styling issues when pasting from word
    // events: {
    //   afterOpenPasteDialog: (dialog, msg, title, callback) => {
    //     dialog.close();
    //     callback();
    //   },
    // },
    readonly: false,
    // uploader: {
    //   url: "https://www.abbagospel.online/api/news/upload",
    //   format: "json",
    //   headers: null,
    //   prepareData: function (data) {
    //     data.append("image", 24); //
    //   },
    //   buildData: function (data) {
    //     return new Promise(function (resolve, reject) {
    //       var reader = new FileReader();
    //       reader.readAsDataURL(data.getAll("files[0]")[0]);
    //       reader.onload = function () {
    //         return resolve({
    //           image: reader.result,
    //         });
    //       };
    //       reader.onerror = function (error) {
    //         reject(error);
    //       };
    //     });
    //   },
    //   data: {
    //     csrf: document
    //       .querySelector('meta[name="csrf-token"]')
    //       .getAttribute("content"),
    //   },
    //   isSuccess: function (resp) {
    //     return !resp.error;
    //   },
    //   getMessage: function (resp) {
    //     return resp.msg;
    //   },
    //   process: function (resp) {
    //     return {
    //       files: resp.files || [],
    //       path: resp.url,
    //       baseurl: resp.baseurl,
    //       error: resp.error,
    //       msg: resp.msg,
    //     };
    //   },
    //   defaultHandlerSuccess: function (data, resp) {
    //     this.s.insertImage(data.path);
    //     var i,
    //       field = "files";
    //     if (data[field] && data[field].length) {
    //       for (i = 0; i < data[field].length; i += 1) {
    //         this.s.insertImage(data.baseurl + data[field][i]);
    //       }
    //     }
    //   },
    //   error: function (e) {
    //     this.e.fire("errorMessage", [e.getMessage(), "error", 400]);
    //   },
    //   contentType: function () {
    //     return "application/json";
    //   },
    // },
  };
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
  });
  const [article, setArticle] = React.useState({
    title: null,
    subtitle: null,
    body: null,
    author: null,
    category: null,
    image: null,
    bodyHtml: null,
    language: null,
  });
  const [toast, setToast] = React.useState({
    message: "",
    open: false,
    type: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const { payload } = verifyToken(token);
    setUser({ firstName: payload.firstname, lastName: payload.lastname });
  }, []);

  const handleChange = (event) => {
    setArticle({ ...article, category: event.target.value });
  };

  const handleChangeLanguage = (event) => {
    setArticle({ ...article, language: event.target.value });
  };

  const handleNewArticle = async () => {
    try {
      setLoadingSubmit(true);
      const token = localStorage.getItem("token");
      const results = await Axios.post(
        "https://www.abbagospel.online/api/new-article",
        {
          title: article.title,
          subtitle: article.subtitle,
          body: content,
          author: `${user.firstName} ${user.lastName}`,
          category: article.category,
          image: article.image,
          bodyhtml: article.bodyHtml,
          language: article.language,
        },
        {
          headers: {
            auth: `${token}`,
          },
        }
      );
      setLoadingSubmit(false);
      setToast({
        message: "Article submitted successfully to the editor!",
        open: true,
        type: "success",
      });
      window.location.reload();
    } catch (error) {
      setLoadingSubmit(false);
      if (error.response) {
        setToast({
          message: error.response.data.message,
          open: true,
          type: "error",
        });
      } else {
        setToast({ message: error.message, open: true, type: "error" });
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      setLoading(true);
      const { files } = document.querySelector('input[type="file"]');
      const formData = new FormData();
      formData.append("image", files[0]);
      const options = {
        method: "POST",
        body: formData,
      };

      // replace cloudname with your Cloudinary cloud_name
      const results = await fetch(
        "https://www.abbagospel.online/api/news/upload",
        options
      );
      const response = await results.json();
      setLoading(false);
      console.log("uploaded!!!");
      setArticle({ ...article, image: response.url });
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setToast({
          message: error.response.data.message,
          open: true,
          type: "error",
        });
      } else {
        setToast({ message: error.message, open: true, type: "error" });
      }
    }
  };

  const handleBody = (event) => {
    console.log("eeent", event);
    setArticle({ ...article, bodyHtml: event });
  };
  const handleText = (event) => {
    setArticle({ ...article, title: event.target.value });
  };
  const handleSub = (event) => {
    setArticle({ ...article, subtitle: event.target.value });
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="news-modal-title"
        aria-describedby="news-modal-description"
        style={{
          position: "absolute",
          top: "50px",
          bottom: "50px",
          border: "none",
          overflow: "scroll",
        }}
      >
        <Container maxWidth="md">
          <Grid
            spacing={3}
            style={{
              backgroundColor: "white",
              paddingRight: "50px",
              paddingLeft: "50px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={toast.open}
              autoHideDuration={3000}
              onClose={() =>
                setTimeout(() => setToast({ ...toast, open: false }), 3000)
              }
            >
              <Alert variant="filled" severity={toast.type}>
                {toast.message}
              </Alert>
            </Snackbar>
            <h3>Post a new article</h3>
            <div style={{ marginBottom: "20px" }}>
              <TextField
                id="standard-basic"
                label="Title"
                margin="dense"
                className={classes.text}
                onChange={handleText}
                required
              />
              <TextField
                id="standard-basic"
                label="Subtitle"
                margin="dense"
                className={classes.text}
                onChange={handleSub}
                required
              />
              <br />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Category *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={article.category ? article.category : ""}
                  onChange={handleChange}
                  label="Category"
                >
                  {props.categories &&
                    props.categories.map((category) => {
                      return (
                        <MenuItem value={`${category.category_name}`}>
                          {category.category_name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Language *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleChangeLanguage}
                  label="Language"
                >
                  <MenuItem value="en-GB">English</MenuItem>
                  <MenuItem value="fr-FR">Francais</MenuItem>
                  <MenuItem value="ki-RW">Kinyarwanda</MenuItem>
                </Select>
              </FormControl>
              <input
                type="file"
                style={{
                  width: "190px",
                  marginTop: "30px",
                  marginLeft: "80px",
                  marginRight: "-1px",
                }}
                required
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginTop: "2px", fontSize: "8px" }}
                onClick={handleImageUpload}
              >
                <CircularProgress
                  size={15}
                  color="secondary"
                  style={{ display: loading ? "" : "none" }}
                />
                {loading ? "" : !article.image ? "Upload" : "Image uploaded"}
              </Button>
            </div>
            {/* <JoditEditor
              ref={editor}
              value={article.bodyHtml}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => {
                setContent(newContent.target.textContent);
                setArticle({
                  ...article,
                  bodyHtml: newContent.target.innerHTML,
                });
              }} // preferred to use only this option to update the content for performance reasons
            /> */}
            <CKEditor
              editor={DecoupledEditor}
              data="Write here..."
              config={{
                extraPlugins: [UploadAdapterPlugin],
              }}
              // onInit={editor => {
              //         editor.plugins.get("FileRepository").createUploadAdapter = loader => {
              //           return new UploadAdapter(loader);
              //         };
              //       }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
                // Insert the toolbar before the editable area.
                editor.ui
                  .getEditableElement()
                  .parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                  );

                this.editor = ckEditor;
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setContent(data);
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
                setArticle({
                  ...article,
                  bodyHtml: editor.getData(),
                });
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginTop: "20px", fontSize: "12px" }}
              onClick={handleNewArticle}
            >
              Submit{" "}
              <CircularProgress
                size={15}
                color="white"
                style={{
                  display: loadingSubmit ? "" : "none",
                  marginLeft: "2px",
                }}
              />
            </Button>
          </Grid>
        </Container>
      </Modal>
    </div>
  );
};

export default AddNews;
