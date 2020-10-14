import React from 'react';
import { makeStyles } from '@material-ui/core';

const styles = theme => ({
  decimalAmount: {
    width: "100%",
    textAlign: "right",
    padding: "0 5px 0",
    display: "inline-block",
  },
  green: {
    color: "green",
  }
})

const useStyles = makeStyles(styles);

function format(number) {
  return Number(number).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PercentageFormat({ amount }) {
  const classes = useStyles();
  return (
    <span className={classes.decimalAmount}>{format(amount * 100)}%</span>
  );
}

export function DecimalFormat(props) {
  const classes = useStyles();
  var amount = props.amount;
  if (amount <= 0) {
    amount = 0 - amount;
  }
  return (<span className={classes.decimalAmount}>
    {(props.isDebit && props.amount > 0) ? format(amount) : ""}
    {(props.isCredit && props.amount > 0) ? format(amount) : ""}
  </span>);
}

export function MiniDecimalFormat({ amount }) {
  const classes = useStyles();

  let formattedAmount = format(amount);
  let className = classes.decimalAmount;
  if (amount < 0) {
    formattedAmount = format(0 - amount);
  } else {
    className += " " + classes.green;
  }


  return (
    <span className={className}>
      {formattedAmount}
    </span>
  );
}

export function MoneyFormat({ amount }) {
  const classes = useStyles();
  return (<span className={classes.decimalAmount}>{format(amount)}</span>);
}