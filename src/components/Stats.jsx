import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});

export default function Stats({ title, value }) {
  const classes = useStyles();
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title ? title : ''}
      </Typography>
      <Typography component="p" variant="h4">
        {value ? value : ''}
      </Typography>
    </>
  );
}
