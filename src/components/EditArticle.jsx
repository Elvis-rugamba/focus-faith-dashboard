import React, { useEffect, useRef } from "react";
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
    minWidth: 200,
  },
}));

const EditNews = (props) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const editor = useRef(null);
  const [content, setContent] = React.useState("");

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
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
  });
  const [foundArticle, setFoundArticleId] = React.useState(props.article)
  const [toast, setToast] = React.useState({
    message: "",
    open: false,
    type: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const { payload } = verifyToken(token);
    setUser({ firstName: payload.firstname, lastName: payload.lastname });
    // const fetchArticle = async () => {
    //   const response = await Axios.get(`http://localhost:3000/api/news/${props.article}`);
    //   // console.log('savagelove+++++++++++++++++++++++++++')
    //   console.log('-------------->', response.data.data);
    //   setFoundArticle(response.data.data);
    // };

    // fetchArticle();
  }, []);

  const handleChange = (event) => {
    setArticle({...article, category: event.target.value})
  };

  const handleLanguageChange = (event) => {
    setArticle({...article, language: event.target.value})
  };


  const handleEditArticle = async () => {
    try {
      setLoadingSubmit(true)
      const token = localStorage.getItem('token');
      const results = await Axios.patch(
        `https://www.abbagospel.online/api/edit-article/${props.article.news_id}`,
        {
          title: article.title ? article.title : props.article.title,
          subtitle: article.subtitle
            ? article.subtitle
            : props.article.subtitle,
          body: content ? content : props.article.body,
          category: article.category
            ? article.category
            : props.article.category,
          bodyhtml: article.bodyHtml
            ? article.bodyHtml
            : props.article.bodyhtml,
          language: article.language
              ? article.language
              : props.article.language,
        },
        {
          headers: { auth: `${token}` },
        }
      );
      setLoadingSubmit(false)
      setToast({
        message: "Article edited and posted successfully!",
        open: true,
        type: "success",
      });
      window.location.reload();

    } catch (error) {
      setLoadingSubmit(false)
      if (error.response) {
        setToast({ message: error.response.data.message, open: true, type: "error" });

       } else {
        setToast({ message: error.message, open: true, type: "error" });
       }
    }
  };

  const handleDeleteArticle = async () => {
    try {
      setLoadingDelete(true)
      const token = localStorage.getItem('token');
      const results = await Axios.delete(
        `https://www.abbagospel.online/api/news/${props.article.news_id}`,
        {
          headers: { auth: `${token}` },
        }
      );
      setLoadingDelete(false)
      setToast({
        message: "Article deleted successfully!",
        open: true,
        type: "success",
      });
      window.location.reload();

    } catch (error) {
      setLoadingDelete(false)
      if (error.response) {
        setToast({ message: error.response.data.message, open: true, type: "error" });

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
    formData.append("file", files[0]);
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
      setLoading(false)
        if (error.response) {
          setToast({ message: error.response.data.message, open: true, type: "error" });
  
         } else {
          setToast({ message: error.message, open: true, type: "error" });
         }
    }
    
  };

  const handleBody = (event) => {
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
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ position: "absolute", top: "50px", border: "none" }}
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
            <h3>Edit article</h3>
            <div style={{ marginBottom: "20px" }}>
              <TextField
                id="standard-basic"
                label="Title"
                margin="dense"
                className={classes.text}
                onChange={handleText}
                defaultValue={props.article.title}
                required
              />
              <TextField
                id="standard-basic"
                label="Subtitle"
                margin="dense"
                className={classes.text}
                onChange={handleSub}
                defaultValue={props.article.subtitle}
                required
              />
              <br />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Category *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    !article.category
                      ? props.article.category
                      : article.category
                  }
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
                <InputLabel id="demo-simple-select-label">Language *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    !article.language
                      ? props.article.language
                      : article.language
                  }
                  onChange={handleLanguageChange}
                  label="Language"
                >
                        <MenuItem value="en-GB">
                            English
                          </MenuItem>
                          <MenuItem value="fr-FR">
                            Francais
                          </MenuItem>
                          <MenuItem value="ki-RW">
                            Kinyarwanda
                          </MenuItem>
                </Select>
              </FormControl>
              <br />
              <input
                  type="file"
                  style={{
                    width: "190px",
                    marginTop: "30px",
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
                  {loading ? "" : !article.image ? "Upload new image" : "Image uploaded"}
                </Button>
              <TextField
                id="standard-basic"
                label="Author"
                margin="dense"
                style={{ marginLeft: "5px" }}
                defaultValue={props.article.author}
                disabled
              />
            </div>
            <JoditEditor
              ref={editor}
              value={props.article.bodyhtml}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => {
                setContent(newContent.target.textContent);
                console.log("whhhhhat", content);
              }} // preferred to use only this option to update the content for performance reasons
              onChange={handleBody}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginTop: "20px", fontSize: "12px" }}
              onClick={handleEditArticle}
            >
              Submit & Post{' '}
            <CircularProgress
              size={15}
              color="white"
              style={{ display: loadingSubmit ? "" : "none", marginLeft: "2px" }}
            />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginTop: "20px", marginLeft: "20px", fontSize: "12px" }}
              onClick={handleDeleteArticle}
            >
              Delete{' '}
            <CircularProgress
              size={15}
              color="white"
              style={{ display: loadingDelete ? "" : "none", marginLeft: "2px" }}
            />
            </Button>
          </Grid>
        </Container>
      </Modal>
    </div>
  );
};

export default EditNews;
