import React from 'react';
import * as reportActions from '../../actions/reportActions';
import ExpensesByCategoryChart from './ExpensesByCategoryChart';
import { useDispatch, useSelector } from 'react-redux';
import ExpensesByCategoryReport from './ExpensesByCategoryReport';

export default function ExpensesByCategoryPage() {

  const report = useSelector(state => state.reports.expensesByCategory);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!report || report.length === 0)
      dispatch(reportActions.loadExpensesByCategoryReport());
  });


  return (
    <div style={{ margin: "10px" }}>
      <h2>Expenses By Category</h2>
      <div style={{ "width": "50%" }}>
        {report && report.expenses &&
          <ExpensesByCategoryChart
            data={report}
          />
        }
      </div>
        {report && report.expenses &&
          <ExpensesByCategoryReport 
            data={report} />
        }
    </div>
  );
}
