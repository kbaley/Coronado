import React from 'react';
import ExpensesByCategoryChart from './ExpensesByCategoryChart';
import ExpensesByCategoryReport from './ExpensesByCategoryReport';

export default function ExpensesByCategoryPage() {

  return (
    <div style={{ margin: "10px" }}>
      <h2>Expenses By Category</h2>
      <div style={{ "width": "50%" }}>
        <ExpensesByCategoryChart />
      </div>
        <ExpensesByCategoryReport />
    </div>
  );
}
