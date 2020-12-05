import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditNews from './EditArticle.jsx';
import CategoriesComponent from './CategoriesComponent.jsx';
import Axios from 'axios';
import { Grid } from '@material-ui/core';
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress  from "@material-ui/core/LinearProgress";

const columns = [
  { id: 'title', label: 'Title', minWidth: 100 },
  {
    id: 'body',
    label: 'Body',
    minWidth: 270,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'category',
    label: 'Category',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    marginTop: '50px',
    maxHeight: 540,
  },
  tableHead: {backgroundColor: 'red'}
});

export default function RadioComponent(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [articles, setArticles] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [categoriesGroup, setCategoriesGroup] = React.useState([]);
  const [singleArticle, setSingleArticle] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({message: '', open: false, type: ''})

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  useEffect(() => {
    const fetchArticles = async () => {
      try { 
        setLoading(true);
        const categories = await Axios.get('https://www.abbagospel.fr/api/radio/categories');
      const categorieGroup = await Axios.get('https://www.abbagospel.fr/api/radio/categories/group');
      const response = await Axios.get('https://www.abbagospel.fr/api/radio');
      // console.log('savagelove+++++++++++++++++++++++++++')
      // console.log('-------------->', response.data.data);
      setCategories(categories.data.data);
      setCategoriesGroup(categorieGroup.data.data);
      setArticles(response.data.data);
      setLoading(false);
      } catch (error) {
        setLoading(false);
        setToast({message: error.message, open: true, type: 'error'})
      }
      
    }
    fetchArticles();
  }, []);
  const sendArticle = () => {
    console.log('article', article)
  }

  return (
    <>
      <CategoriesComponent
        categories={categories}
        categoriesGroup={categoriesGroup}
        type="radio"
      />
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          {loading ? <LinearProgress 
              size={15}
            /> : ""}
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
              {articles.length === 0
                ? "No radio yet"
                : articles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((article) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={article.news_id}
                          onClick={() =>  setSingleArticle(article)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {columns.map((column) => {
                            let value = article[column.id];
                            // if (article["body"])
                            //   value = `${value.slice(0, 80)}...`;
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value === article.body
                                  ? `${value.slice(0, 50)}...`
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
              <EditNews
                open={singleArticle.hasOwnProperty("id") ? true : false}
                article={singleArticle}
                categories={categories}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={articles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}