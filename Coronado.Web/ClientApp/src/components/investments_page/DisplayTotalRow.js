import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";

const DisplayTotalRow = ({text, value}) => {
  return (
      <tr>
        <td colSpan="6" style={{textAlign: 'right', fontWeight: 'bold', paddingRight: '100px'}}>{text}</td>
        <td><CurrencyFormat value={value} /></td>
      </tr>
  );
};

export default DisplayTotalRow;