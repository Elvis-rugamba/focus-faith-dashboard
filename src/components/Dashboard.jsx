import React, {useEffect} from "react";
import clsx from "clsx";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";
import SignIn from "./Signin.jsx";
import SignUp from "./Signup.jsx";
import FloatingActionButtons from "./FloatingButton.jsx";
import verifyToken from '../helpers/verifyToken';
import NewsTable from "./NewsComponent.jsx";
import TextEditor from "./TextEditor.jsx";
import AddNews from "./AddNews.jsx";
import AddUser from "./AddUsers.jsx";
import logo from "../assets/img/logo.png";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TvIcon from "@material-ui/icons/Tv";
import AlbumIcon from "@material-ui/icons/Album";
import DescriptionIcon from "@material-ui/icons/Description";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import UsersTable from "./Users.jsx";
import Axios from 'axios';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logo: {
    width: "150px",
    paddingTop: "8px",
    paddingBottom: "8px"
  },
  avatar: {
    position: "absolute",
    top: "20px",
    left: "10px",
  },
  avatarName: {
    position: "absolute",
    top: "23px",
    left: "35px",
  },
}));
const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  let history = useHistory();
  let location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openNewsModal, setOpenNewsModal] = React.useState(false);
  const [openUserModal, setOpenUserModal] = React.useState(false);
   const [user, setUser] = React.useState({
        firstName: '',
        lastName: ''
    });
      const [categories, setCategories] = React.useState([]);
  const [role, setRole] = React.useState('');
  const [path, setPath] = React.useState('')
  useEffect(() => {
    const token = localStorage.getItem('token');
    const {payload} = verifyToken(token)
    setUser({ firstName: payload.firstname, lastName: payload.lastname });
    setRole(payload.role);
    const fetchArticles = async () => {
      const categories = await Axios.get(
        "http://localhost:3000/api/categories"
      );
      // console.log('savagelove+++++++++++++++++++++++++++')
      // console.log('-------------->', response.data.data);
      setCategories(categories.data.data);
    };
        fetchArticles();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleUsers = () => {
    setShowUsers(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} className={classes.logo} />
          </Toolbar>
        </AppBar>
        <AddNews
          open={openNewsModal}
          categories={categories}
          onClose={() => setOpenNewsModal(false)}
        />
        <AddUser
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
        />
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div>
            <PersonIcon className={classes.avatar} />
            <span
              className={classes.avatarName}
            >{`${user.firstName} ${user.lastName}`}</span>
          </div>
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <List style={{ height: "698px" }}>
            {[
              {
                text: "News",
                icon: <DescriptionIcon />,
                path: "/news",
                onClick: () => setPath("/news"),
              },
              { text: "TV Shows", icon: <TvIcon />, path: "/" },
              { text: "Music", icon: <AlbumIcon />, path: "/" },
              role === "admin"
                ? {
                    text: "Users",
                    icon: <PeopleAltRoundedIcon />,
                    path: "/users",
                    onClick: () => setPath("/users"),
                  }
                : "",
            ].map((item, index) => (
              <Link to={item.path}>
                <ListItem button key={item.text} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                history.push("/auth/signin");
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <Switch>
            <Route
              path="/news"
              exact
              render={(props) => (
                <NewsTable {...props} role={role ? role : "writer"} />
              )}
            />
            <Route path="/users" component={UsersTable} />
          </Switch>
          <FloatingActionButtons
            onClick={() => {
              console.log(
                "history",
                window.location.pathname === "/",
                "sleep",
                path
              );
              if (window.location.pathname === "/users") {
                setOpenNewsModal(false);
                setOpenUserModal(true);
                return;
              }
              setOpenUserModal(false);
              setOpenNewsModal(true);
              console.log("state", openNewsModal, openUserModal);
            }}
            style={{ display: window.location.pathname === "/" ? "none" : "" }}
          />
        </main>
      </div>
    </Router>
  );
};

export default Dashboard;
