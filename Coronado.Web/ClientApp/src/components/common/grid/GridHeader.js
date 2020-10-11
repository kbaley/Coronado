import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  header: {
    ...theme.table.head,
  },
  right: {
    textAlign: "right",
  }
});

const useStyles = makeStyles(styles);

export default function GridHeader({ children, alignRight, ...other }) {
  const classes = useStyles();
  let classNames = classes.header;
  if (alignRight) classNames += " " + classes.right;
  if (other.className) {
    classNames += " " + other.className;
  }
  return (
    <Grid item
      {...other}
      className={classNames}
    >
      {children}
    </Grid>
  )
}
