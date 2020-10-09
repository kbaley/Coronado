import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  header: {
    ...theme.table.head,
  },
});

const useStyles = makeStyles(styles);

export default function GridHeader({ children, xs, sm, lg, md }) {
  const classes = useStyles();
  return (
    <Grid item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      className={classes.header}
    >
      {children}
    </Grid>
  )
}
