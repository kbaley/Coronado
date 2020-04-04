import React from 'react';
import { CurrencyFormat } from "../common/CurrencyFormat";
import { sumBy } from 'lodash';

const InvestmentsTotal = ({investments, currency, currencies}) => {
  var total = sumBy(investments, i => (i.shares * i.price)).toFixed(2);
  return (
    <React.Fragment>
      <tr>
        <td colSpan="6" style={{textAlign: 'right', fontWeight: 'bold', paddingRight: '100px'}}>Total</td>
        <td><CurrencyFormat value={total} /></td>
      </tr>
      {currency === 'CAD' &&
      <tr>
        <td colSpan="6" style={{textAlign: 'right', fontWeight: 'bold', paddingRight: '100px'}}>Total in USD ({Number(currencies['CAD']).toFixed(4)})</td>
        <td><CurrencyFormat value={total / currencies['CAD']} /></td>
      </tr>
      }
    </React.Fragment>
  );
};

export default InvestmentsTotal;