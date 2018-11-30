import React from 'react';
import './DecimalFormat.css';

function format(number) {
  return Number(number).toLocaleString('en', {minimumFractionDigits: 2});
}

export function DecimalFormat(props) {
  var amount = props.amount;
  if (amount <= 0) {
    amount = 0 - amount;
  }
  return (<span className="decimalAmount">
    {(props.isDebit && props.amount > 0) ? format(amount) : ""}
    {(props.isCredit && props.amount > 0) ? format(amount) : ""}
  </span>);
}

export function MoneyFormat({amount}) {
  return (<span className="decimalAmount">{format(amount)}</span>);
}