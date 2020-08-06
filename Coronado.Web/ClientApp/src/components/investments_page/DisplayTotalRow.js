import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";
import { makeStyles, Grid, Hidden } from '@material-ui/core';

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
  const { text, value, secondaryValue } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={1} md={5} className={classes.footer}></Grid>
      <Grid item xs={7} md={5} className={classes.footer}>{text}</Grid>
      <Hidden smDown>
      <Grid item xs={1} className={classes.footer}>
        {secondaryValue !== null &&
        <CurrencyFormat value={secondaryValue} />
        }
      </Grid>
      </Hidden>
      <Grid item xs={4} md={1} className={classes.footer}>
        <CurrencyFormat value={value} />
      </Grid>
    </React.Fragment>
  );
};
