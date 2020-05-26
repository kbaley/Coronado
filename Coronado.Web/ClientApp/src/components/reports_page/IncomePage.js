import React from 'react';
import IncomeReport from './IncomeReport';
import IncomeChart from './IncomeChart';

export default function IncomePage() {

  return (
    <div style={{ margin: "10px" }}>
      <h2>Income</h2>
      <div style={{ "width": "50%" }}>
        <IncomeChart />
      </div>
        <IncomeReport  />
    </div>
  );
}
