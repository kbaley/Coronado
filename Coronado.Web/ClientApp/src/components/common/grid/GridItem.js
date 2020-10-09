import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  cell: {
    ...theme.table.cell,
  },
});

const useStyles = makeStyles(styles);

export default function GridItem({ children, xs, sm, lg, md }) {
  const classes = useStyles();
  return (
    <Grid item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      className={classes.cell}
    >
      {children}
    </Grid>
  )
}

