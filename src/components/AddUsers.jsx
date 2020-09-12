import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
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
import Axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  text: {
    margin: "10px",
  },

  formControl: {
    width: "40%",
    margin: "10px",
  },
}));

export default function AddUser(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  });
  const [toast, setToast] = React.useState({
    message: "",
    open: false,
    type: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChangeRole = (event) => {
    setUser({...user, role: event.target.value})
  }
  const handleChangeFirst = (event) => {
    setUser({...user, firstName: event.target.value})
  }
  const handleChangeLast = (event) => {
    setUser({...user, lastName: event.target.value})
  }
  const handleChangeEmail = (event) => {
    setUser({...user, email: event.target.value})
  };
  const handleChangePhone = (event) => {
    setUser({...user, phone: event.target.value})
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    try {
          event.preventDefault();
          const results = await Axios.post(
            "https://www.abbagospel.online/api/new-user",
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              password: user.password
            }
          );
          setToast({
            message: "User created",
            open: true,
            type: "success",
          });
          window.location.reload();
        } catch (error) {
          if(error.response.status === 409) return setToast({message: error.response.data.message, open: true, type: 'error'})
          return error.message;
        }
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Container maxWidth="sm">
            <Grid
              spacing={3}
              style={{
                backgroundColor: "white",
                paddingRight: "30px",
                paddingLeft: "30px",
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
              <h3>Create a new user</h3>
              <div style={{ marginBottom: "20px" }}>
                <TextField
                  id="standard-basic"
                  label="First Name"
                  margin="dense"
                  className={classes.text}
                  onChange={handleChangeFirst}
                />
                <TextField
                  id="standard-basic"
                  label="Last Name"
                  margin="dense"
                  className={classes.text}
                  onChange={handleChangeLast}
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user.role}
                    onChange={handleChangeRole}
                    label="Role"
                  >
                    <MenuItem value="writer">writer</MenuItem>
                    <MenuItem value="editor">editor</MenuItem>
                    <MenuItem value="artist">artist</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="standard-basic"
                  label="Email"
                  margin="dense"
                  className={classes.text}
                  onChange={handleChangeEmail}
                />
                <TextField
                  id="standard-basic"
                  label="Generate password"
                  margin="dense"
                  value={user.password}
                  className={classes.text}
                  // onChange={handlePassword}
                />
                <Tooltip title="Generate password" arrow>
                    <VpnKeyIcon
                    style={{
                      width: "15px",
                      position: "absolute",
                      top: "385px",
                      left: "620px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      let autoPassword = Math.random()
                        .toString(36)
                        .substring(7);
                      setUser({ ...user, password: autoPassword });
                      console.log("weeeee", user.password);
                    }}
                  />
                </Tooltip>

                <TextField
                  id="standard-basic"
                  label="Phone"
                  margin="dense"
                  className={classes.text}
                  onChange={handleChangePhone}
                />
                <br />
              </div>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginTop: "20px", fontSize: "12px" }}
                onClick={handleSubmit}
              >
                Create User
              </Button>
            </Grid>
          </Container>
        </Fade>
      </Modal>
    </div>
  );
}
