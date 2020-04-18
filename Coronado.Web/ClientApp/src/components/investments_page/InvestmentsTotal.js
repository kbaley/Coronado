import React from 'react';
import { sumBy } from 'lodash';
import DisplayTotalRow from './DisplayTotalRow';

const InvestmentsTotal = ({investments, currency, currencies}) => {
  var total = sumBy(investments, i => parseFloat(i.currentValue));
  
  return (
    <React.Fragment>
      <DisplayTotalRow text="Total" value={total} />
      {currency === 'CAD' &&
      <DisplayTotalRow text={"Total in USD (" + Number(currencies['CAD']).toFixed(4) + ")"} value={total / currencies['CAD']} />
      }
    </React.Fragment>
  );
};

export default InvestmentsTotal;