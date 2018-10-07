import React from 'react';

export function CurrencyFormat(props) {
  return (<span>{Number(props.value).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</span>);
}