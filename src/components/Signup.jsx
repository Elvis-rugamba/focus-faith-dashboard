
import React, {useState} from "react";
import {Link} from 'react-router-dom';
import SignIn from './Signin.jsx';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.abbagospel.fr">
        Abbagospel
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    phone: ''
  })
  const [loading, setLoading] = React.useState(false);

   const handleSubmit = async (event) => {
     event.preventDefault();
     setLoading(true)
     try {
       const results = await Axios.post("https://www.abbagospel.fr/api/new-user", {
       firstName: user.firstName,
       lastName: user.lastName,
       email: user.email,
       password: user.password,
       role: user.role,
       phone: user.phone
     });
     const response = await results.json();
     setLoading(false)
     history.push('/auth/signin');
     } catch (error) {
      setLoading(false);
      if (error.response.data.status == 401) {
        setToast({
          message: error.response.data.message,
          open: true,
          type: "error",
        });
      }
      setToast({
        message: error.response.data.message,
        open: true,
        type: "error",
      });
     }
     
   };


   const handleFirstName = ({ target }) => {
     setUser({ ...user, firstName: target.value });
   };
   const handleLastName = ({ target }) => {
     setUser({ ...user, lastName: target.value });
   };
   const handleEmail = ({ target }) => {
     setUser({ ...user, email: target.value });
   };
   const handlePassword = ({ target }) => {
     setUser({ ...user, password: target.value });
   };
   const handleRole = ({ target }) => {
     setUser({ ...user, role: target.value });
   };
   const handlePhone = ({ target }) => {
     setUser({ ...user, phone: target.value });
   };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleFirstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleLastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Role"
                id="role"
                onChange={handleRole}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                label="Phone number"
                id="phone"
                onChange={handlePhone}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up {' '}
            <CircularProgress
              size={15}
              color="white"
              style={{ display: loading ? "" : "none", marginLeft: "2px" }}
            />
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/auth/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}