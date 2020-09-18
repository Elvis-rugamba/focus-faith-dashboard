import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Axios from "axios";
import { Grid, Typography } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    // marginTop: '50px',
    // maxHeight: 540,
  },
  tableHead: { backgroundColor: "red" },
});

export default function NewsTable({ title, articles }) {
  const classes = useStyles();

  const columns = [
    { id: "title", label: "Title", minWidth: 200 },
    {
      id: "category",
      label: "Category",
      minWidth: 100,
      format: (value) => value.toFixed(2),
    },
    {
      id: "author",
      label: "Author",
      minWidth: 100,
      format: (value) => value.toFixed(2),
    },
    title === "Most read Articles"
      ? {
          id: "counts",
          label: "Counts",
          minWidth: 100,
          format: (value) => value.toFixed(2),
        }
      : {
          id: "status",
          label: "Status",
          minWidth: 100,
          format: (value) => value.toFixed(2),
        },
  ];

  return (
    <>
      <Paper className={classes.root}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {articles && articles.length === 0
                ? "No articles yet"
                : articles.map((article) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={article.news_id}
                      >
                        {columns.map((column) => {
                          let value = article[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value === article.title
                                ? `${value.slice(0, 100)}...`
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
