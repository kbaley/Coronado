import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  row: {
    // ...theme.table.paddedRow,
  },
});

const useStyles = makeStyles(styles);

export default function GridRow({children, ...other}) {
  const classes = useStyles();
  let className = classes.row;
  if (other.className) {
    className += " " + other.className;
  }
  return (
    <Grid container item
      {...other}
      className={className}
    >
      {children}
    </Grid>
  )
}

