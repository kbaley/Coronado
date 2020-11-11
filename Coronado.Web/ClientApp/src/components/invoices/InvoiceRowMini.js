import React from 'react';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { Grid, makeStyles } from '@material-ui/core';

const styles = theme => ({
  gridRow: {
    padding: 7,
    fontSize: 14,
    color: "#263238",
    backgroundColor: theme.palette.white,
    borderBottom: "1px solid #ddd",
  },
})

const useStyles = makeStyles(styles);

export function InvoiceRowMini({ invoice }) {
  const classes = useStyles();

  return (
    <Grid container spacing={0} item xs={12} className={classes.gridRow}>

      <Grid item xs={1}>{invoice.invoiceNumber}</Grid>
      <Grid item xs={8}>{invoice.customerName}</Grid>
      <Grid item xs={3}><CurrencyFormat value={invoice.balance} /></Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={11}>{invoice.customerEmail}</Grid>
      {invoice.lastSentToCustomer &&
        <React.Fragment>
          <Grid item xs={1}></Grid>
          <Grid item xs={11}>
            <span>Emailed: </span>
            {new Date(invoice.lastSentToCustomer).toLocaleDateString()}
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}