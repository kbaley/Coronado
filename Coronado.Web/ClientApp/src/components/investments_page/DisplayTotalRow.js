import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  footer: {
    fontSize: "18px",
    fontWeight: 500,
    backgroundColor: "#eee",
    lineHeight: "1.5rem",
    padding: "10px 0",
  }
});

export default function DisplayTotalRow(props) {
  const { text, value } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={1} sm={8} className={classes.footer}></Grid>
      <Grid item xs={5} sm={2} className={classes.footer}>{text}</Grid>
      <Grid item xs={6} sm={2} className={classes.footer}>
        <CurrencyFormat value={value} />
      </Grid>
    </React.Fragment>
  );
};
