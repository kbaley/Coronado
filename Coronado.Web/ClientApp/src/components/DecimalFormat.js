import React from 'react';

export function DecimalFormat(props) {
  var amount = props.amount;
  if (amount <= 0) {
    amount = 0 - amount;
  }
  return (<span>
    {(props.isDebit && props.amount <= 0) ? Number(amount).toFixed(2) : ""}
    {(props.isCredit && props.amount > 0) ? Number(amount).toFixed(2) : ""}
  </span>);
}