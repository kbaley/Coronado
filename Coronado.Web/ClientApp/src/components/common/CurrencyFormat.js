import React from 'react';
import './CurrencyFormat.css';

export function CurrencyFormat({value}) {
  return (
    <span className="currency">
      {Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
    </span>
  );
}

