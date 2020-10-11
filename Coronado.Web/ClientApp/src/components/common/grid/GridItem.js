import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  cell: {
    ...theme.table.cell,
  },
});

const useStyles = makeStyles(styles);

export default function GridItem({ children, ...other }) {
  const classes = useStyles();
  let className = classes.cell;
  if (other.className) {
    className += " " + other.className;
  }
  return (
    <Grid item
      {...other}
      className={className}
    >
      {children}
    </Grid>
  )
}

