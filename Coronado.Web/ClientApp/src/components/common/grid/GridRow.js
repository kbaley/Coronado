import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  row: {
    ...theme.table.paddedRow,
  },
});

const useStyles = makeStyles(styles);

export default function GridRow({ children, xs, sm, lg, md }) {
  const classes = useStyles();
  return (
    <Grid container item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      className={classes.row}
    >
      {children}
    </Grid>
  )
}

