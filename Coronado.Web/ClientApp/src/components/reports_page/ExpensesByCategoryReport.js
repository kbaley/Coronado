import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderBy, find } from 'lodash';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';
import './ExpensesByCategoryReport.css';

class ExpensesByCategoryReport extends Component {

  componentDidMount() {
    this.props.actions.loadExpensesByCategoryReport();
  }

  getExpense = (expense, month) => {
    var foundExpense = find(expense.expenses, (e) => { return e.date === month.date});
    if (foundExpense)
      return <CurrencyFormat value={foundExpense.amount} />;
    return <span></span>;
  }
  
  render() {
    return (
      <div style={{margin: "10px"}}>
        <h4>Expenses By Category</h4>
        <table className="table expensesTable" style={{width: "400px"}}>
          <thead>
            <tr>
              <th>Expense</th>

              {this.props.report.monthTotals && orderBy(this.props.report.monthTotals, ['date'], ['desc']).map( ( e, i ) =>
                <th key={i} style={{textAlign: "right"}}>
                  <Moment format="MMMM YYYY">{e.date}</Moment>
                </th>
              )}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.props.report.expenses && this.props.report.expenses.map( (r, index) =>
              <tr key={index}>
                <td>
                  {r.categoryName}
                </td>
                {this.props.report.monthTotals.map( ( m, i ) =>
                  <td key={i}>
                    {this.getExpense(r, m)}
                  </td>
                )}
                <td>
                  <CurrencyFormat value={r.total} />
                </td>
              </tr>
            )}
            <tr>
              <td>Total</td>
              {this.props.report.monthTotals && this.props.report.monthTotals.map( ( m, i ) =>
                <td key={i}>
                  <CurrencyFormat value={m.total} />
                </td>
              )}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    report: state.reports.expensesByCategory
  };
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators(reportActions, dispatch)
   }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpensesByCategoryReport);