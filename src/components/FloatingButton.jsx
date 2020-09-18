import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  fab: {
    position: 'fixed',
    bottom: '50px',
    right: '50px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FloatingActionButtons(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        style={props.style}
      >
        <AddIcon onClick={props.onClick} />
      </Fab>
    </div>
  );
}