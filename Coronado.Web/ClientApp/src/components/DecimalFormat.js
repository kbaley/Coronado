import React from 'react';
import './DecimalFormat.css';

export function DecimalFormat(props) {
  var amount = props.amount;
  if (amount <= 0) {
    amount = 0 - amount;
  }
  return (<span className="decimalAmount">
    {(props.isDebit && props.amount <= 0) ? Number(amount).toFixed(2) : ""}
    {(props.isCredit && props.amount > 0) ? Number(amount).toFixed(2) : ""}
  </span>);
}

export function MoneyFormat(props) {
  return (<span className="decimalAmount">{Number(props.amount).toFixed(2)}</span>);
}