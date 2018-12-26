import React from 'react';
import './CurrencyFormat.css';

export function CurrencyFormat({value}) {
  return (
    <span className="currency">
      {Currency(value)}
    </span>
  );
}

export function Currency(value) {
  return (
    Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
  );
}

