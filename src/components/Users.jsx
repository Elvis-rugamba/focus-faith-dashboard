import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import LinearProgress from "@material-ui/core/LinearProgress";
import Axios from "axios";

const columns = [
  { id: "firstname", label: "First Name", minWidth: 100 },
  {
    id: "lastname",
    label: "Last Name",
    minWidth: 170,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "email",
    label: "Email",
    minWidth: 270,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "role",
    label: "Role",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    marginTop: "90px",
    maxHeight: 440,
  },
  tableHead: { backgroundColor: "red" },
});

export default function UsersTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          "https://www.abbagospel.fr/api/users"
        );
        // console.log('savagelove+++++++++++++++++++++++++++')
        // console.log('-------------->', response.data.data);
        setUsers(response.data.data);
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
    fetchUsers();
  }, []);

  return (
    <Paper className={classes.root}>
      {console.log("tryyyyyyyy", users)}
      <TableContainer className={classes.container}>
        {loading ? <LinearProgress size={15} /> : ""}
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
            {users.length === 0
              ? "No Users yet"
              : users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user.user_id}
                      >
                        {columns.map((column) => {
                          const value = user[column.id];

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
