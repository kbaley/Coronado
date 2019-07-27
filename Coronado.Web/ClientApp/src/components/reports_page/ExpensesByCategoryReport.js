import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderBy } from 'lodash';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';

class ExpensesByCategoryReport extends Component {

  componentDidMount() {
    this.props.actions.loadExpensesByCategoryReport();
  }
  
  render() {
    return (
      <div style={{margin: "10px"}}>
        <h4>Expenses By Category</h4>
        <table className="table" style={{width: "400px"}}>
          <thead>
            <tr>
              <th>Expense</th>

              {this.props.report[0] && orderBy(this.props.report[0].expenses, ['date'], ['desc']).map( ( e, i ) =>
                <th key={i} style={{textAlign: "right"}}>
                  <Moment format="MMMM YYYY">{e.date}</Moment>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {this.props.report.map( (r, index) =>
              <tr key={index}>
                <td>
                  {r.name}
                </td>
                  {orderBy(r.expenses, ['date'], ['desc']).map( (e, i) =>
                  <td key={i}>
                    {e.amount > 0 &&
                    <CurrencyFormat value={e.amount} />
                    }
                  </td>
                  )}
              </tr>
            )}
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