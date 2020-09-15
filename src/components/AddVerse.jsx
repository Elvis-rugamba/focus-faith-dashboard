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

const AddVerse = (props) => {
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
        body: null,
        frensh: null,
        rwandan: null,
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

    const handleChangeLanguage = (event) => {
      setArticle({...article, language: event.target.value});
      
  };

    const handleNewArticle = async () => {
        try {
          setLoadingSubmit(true)
          const results = await Axios.post(
            "https://www.abbagospel.online/api/verses",
            {
              body: article.body,
              french: article.frensh,
              rwandan: article.rwandan,
            },
          );
          setLoadingSubmit(false)
          setToast({message: 'Verse of the day submitted successfully!', open: true, type: 'success'});
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

    const handleEnglish = (event) => {
        setArticle({...article,
            body: event.target.value,
        })
    };
    
    const handleFrensh = (event) => {
        setArticle({...article,
            frensh: event.target.value,
        })
    };
    
    const handleRwandan = (event) => {
        setArticle({...article,
            rwandan: event.target.value,
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
              <h3>Post a verse of the day</h3>
              <div style={{ marginBottom: "20px", width: "100%" }}>
                <TextField
                  id="standard-basic"
                  label="English"
                  margin="dense"
                  variant="outlined"
                  className={classes.text}
                  onChange={handleEnglish}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
                < br/>
                <TextField
                  id="standard-basic"
                  label="Frensh"
                  margin="dense"
                  variant="outlined"
                  className={classes.text}
                  onChange={handleFrensh}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
                <br />
                <TextField
                  id="standard-basic"
                  label="Kinyarwanda"
                  margin="dense"
                  variant="outlined"
                  className={classes.text}
                  onChange={handleRwandan}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </div>
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

export default AddVerse;