import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Axios from "axios";
import { Grid } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import Stats from "./Stats.jsx";
import RecentArticles from "./Recent.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    marginTop: "100px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 200,
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.abbagospel.online">
        Abbagospel
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function NewsTable(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [totalArticles, setTotalArticles] = React.useState(0);
  const [totalPendingArticles, setTotalPending] = React.useState(0);
  const [totalReads, setTotalReads] = React.useState(0);
  const [totalCategories, setTotalCategories] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [recentArticles, setRecentArticles] = React.useState([]);
  const [mostReadArticles, setMostReadArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({
    message: "",
    open: false,
    type: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const totalArticlesRes = await Axios.get(
          "https://www.abbagospel.online/api/news/stats/total"
        );
        const totalPendingArticlesRes = await Axios.get(
          "https://www.abbagospel.online/api/news/stats/total-pending"
        );
        const totalReadsRes = await Axios.get(
          "https://www.abbagospel.online/api/news/stats/total-read"
        );
        const totalCategoriesRes = await Axios.get(
          "https://www.abbagospel.online/api/categories/total"
        );
        const totalUsersRes = await Axios.get(
          "https://www.abbagospel.online/api/users/total",
          {
            headers: { auth: `${token}` },
          }
        );
        const recentNewsRes = await Axios.get(
          "https://www.abbagospel.online/api/news/stats/recent"
        );
        const mostReadRes = await Axios.get(
          "https://www.abbagospel.online/api/news/stats/most-read"
        );

        setTotalArticles(totalArticlesRes.data.data);
        setTotalPending(totalPendingArticlesRes.data.data);
        setTotalCategories(totalCategoriesRes.data.data);
        setTotalUsers(totalUsersRes.data.data);
        setRecentArticles(recentNewsRes.data.data);
        setMostReadArticles(mostReadRes.data.data)
        setTotalReads(totalReadsRes.data.data)
        setLoading(false);
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
    fetchStats();
  }, []);

  return (
    <>
      <Paper className={classes.root}>
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
        <Container maxWidth="lg" className={classes.container}>
          {loading ? <LinearProgress size={15} /> : ""}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats title="Total Articles" value={totalArticles} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats title="Total Categories" value={totalCategories} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats title="Total Reads" value={totalReads} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats title="Total Users" value={totalUsers} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats
                  title="Total Pending Articles"
                  value={totalPendingArticles}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <RecentArticles
                  title="Most read Articles"
                  articles={mostReadArticles}
                />
              </Paper>
            </Grid>
            {/* <Grid item xs={12}>
              <Paper className={classes.paper}>
                <RecentArticles
                  title="Most read Categories"
                  articles={recentArticles}
                />
              </Paper>
            </Grid> */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <RecentArticles
                  title="Recent Articles"
                  articles={recentArticles}
                />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </Paper>
    </>
  );
}
