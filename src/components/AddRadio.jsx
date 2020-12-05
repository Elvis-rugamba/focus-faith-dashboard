import React, { useEffect, useRef, useMemo } from "react";
import { makeStyles } from '@material-ui/core/styles';
import verifyToken from "../helpers/verifyToken";
import JoditEditor from "jodit-react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TextEditor from './TextEditor.jsx';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Container, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import Axios from 'axios';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        top: '50px',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    text: {
        marginLeft: '10px'
    },
    editor: {
        overflowY: 'scroll'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}));

const AddRadio = (props) => {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    // const [modalStyle] = React.useState(getModalStyle);
    const editor = useRef(null);
    const [content, setContent] = React.useState("");

    const config = {
      // all options from https://xdsoft.net/jodit/doc/
      askBeforePasteHTML: false,
      askBeforePasteFromWord: true, //couse styling issues when pasting from word
      events: {
        afterOpenPasteDialog: (dialog, msg, title, callback) => {
          dialog.close();
          callback();
        },
      },
    };
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [user, setUser] = React.useState({
        firstName: '',
        lastName: ''
    });
    const [article, setArticle] = React.useState({
        title: null,
        body: null,
        category: null,
        cover: null,
        bodyHtml: null,
        url: null,
        language: null
    });
    const [toast, setToast] = React.useState({message: '', open: false, type: ''})
    const [loading, setLoading] = React.useState(false)
    const [loadingSubmit, setLoadingSubmit] = React.useState(false)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const { payload } = verifyToken(token);
        setUser({firstName: payload.firstname, lastName: payload.lastname});
    }, []);

    const handleChange = (event) => {
        setArticle({...article, category: event.target.value});
        
    };

    const handleLanguage = (event) => {
      setArticle({...article, language: event.target.value});
      
  };

    const handleNewArticle = async () => {
        try {
          setLoadingSubmit(true)
          const token = localStorage.getItem("token");
          const results = await Axios.post(
            "https://www.abbagospel.fr/api/radio",
            {
              title: article.title,
              body: content,
              host: article.host,
              category: article.category,
              cover: article.image,
              url: article.url,
              language: article.language,
              bodyhtml: article.bodyHtml
            },
            {
              headers: { 
               auth: `${token}`
             },
            }
          );
          setLoadingSubmit(false)
          setToast({message: 'Article submitted successfully to the editor!', open: true, type: 'success'});
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

    const handleImageUpload = async () => {
      try {
        setLoading(true);
        const { files } = document.querySelector('#cover')
        const formData = new FormData();
        formData.append('image', files[0]);
        // replace this with your upload preset name
        const options = {
          method: 'POST',
          body: formData,
        };
        
        // replace cloudname with your Cloudinary cloud_name
        const results = await fetch('https://www.abbagospel.fr/api/radio/cover', options);
        const response = await results.json();
        setLoading(false);
        console.log('uploaded!!!');
        setArticle({...article, image: response.url});
      } catch (error) {
        setLoading(false)
        if (error.response) {
          setToast({ message: error.response.data.message, open: true, type: "error" });
  
         } else {
          setToast({ message: error.message, open: true, type: "error" });
         }
      }
      
    }

    const handleVideoUpload = async () => {
      try {
        setLoading(true);
        const { files } = document.querySelector('#radio')
        const formData = new FormData();
        formData.append('radio', files[0]);
        // replace this with your upload preset name
        const options = {
          method: 'POST',
          body: formData,
        };
        
        // replace cloudname with your Cloudinary cloud_name
        const results = await fetch('https://www.abbagospel.fr/api/radio/upload', options);
        const response = await results.json();
        setLoading(false);
        console.log('uploaded!!!');
        setArticle({...article, url: response.url});
      } catch (error) {
        setLoading(false)
        if (error.response) {
          setToast({ message: error.response.data.message, open: true, type: "error" });
  
         } else {
          setToast({ message: error.message, open: true, type: "error" });
         }
      }
      
    }

    const handleBody = (event) => {
      console.log('eeent', event);
        setArticle({...article, bodyHtml: event});
    };
    const handleText = (event) => {
        setArticle({...article,
            title: event.target.value,
        })
    };

    return (
      <div>
        <Modal
          open={props.open}
          onClose={props.onClose}
          aria-labelledby="news-modal-title"
          aria-describedby="news-modal-description"
          style={{ position: "absolute", top: "50px", border: "none", overflow: "auto" }}
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
              <h3>Post a radio</h3>
              <div style={{ marginBottom: "20px" }}>
                <TextField
                  id="standard-basic"
                  label="Title"
                  margin="dense"
                  className={classes.text}
                  onChange={handleText}
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
                    onChange={handleLanguage}
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
                  id="cover"
                  style={{
                    width: "190px",
                    marginTop: "30px",
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
                  {loading ? "" : !article.image ? "Upload Cover" : "Cover uploaded"}
                </Button>
                <input
                  type="file"
                  id="radio"
                  style={{
                    width: "190px",
                    marginTop: "30px",
                    marginLeft: "30px",
                    marginRight: "-1px",
                  }}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginTop: "2px", fontSize: "8px" }}
                  onClick={handleVideoUpload}
                >
                  <CircularProgress
                    size={15}
                    color="secondary"
                    style={{ display: loading ? "" : "none" }}
                  />
                  {loading ? "" : !article.url ? "Upload Radio" : "Radio uploaded"}
                </Button>
              </div>
              <JoditEditor
                ref={editor}
                value={article.bodyHtml}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {
                  setContent(newContent.target.textContent);
                  setArticle({ ...article, bodyHtml: newContent.target.innerHTML });
                  
                }} // preferred to use only this option to update the content for performance reasons
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginTop: "20px", fontSize: "12px" }}
                onClick={handleNewArticle}
              >
                Submit{' '}
            <CircularProgress
              size={15}
              color="white"
              style={{ display: loadingSubmit ? "" : "none", marginLeft: "2px" }}
            />
              </Button>
            </Grid>
          </Container>
        </Modal>
      </div>
    );
}

export default AddRadio;