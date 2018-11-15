import React from 'react';

export function CurrencyFormat({value}) {
  return (<span>{Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</span>);
}

