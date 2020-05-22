import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderBy, find } from 'lodash';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';
import './ExpensesByCategoryReport.css';
import { withStyles, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';

const styles = theme => ({
  total: {
    backgroundColor: theme.palette.gray[2]
  }
});

class ExpensesByCategoryReport extends Component {

  componentDidMount() {
    this.props.actions.loadExpensesByCategoryReport();
  }

  getExpense = (expense, month) => {
    var foundExpense = find(expense.amounts, (e) => { return e.date === month.date});
    if (foundExpense)
      return <CurrencyFormat value={foundExpense.amount} />;
    return <span></span>;
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div style={{margin: "10px"}}>
        <h2>Expenses By Category</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expense</TableCell>
              {this.props.report.monthTotals && orderBy(this.props.report.monthTotals, ['date'], ['desc']).map( ( e, i ) =>
                <TableCell
                  key={i}
                  align="right"
                >
                  <Moment format="MMMM YYYY">{e.date}</Moment>
                </TableCell>
              )}
                <TableCell
                  align="right"
                >Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.report.expenses && this.props.report.expenses.map( (r, index) =>
              <TableRow 
                key={index}
              >
                <TableCell>{r.categoryName}</TableCell>
                {this.props.report.monthTotals.map( ( m, i ) =>
                <TableCell key={i}>{this.getExpense(r, m)}</TableCell>
                )}
                <TableCell className={classes.total}><CurrencyFormat value={r.total} /></TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className={classes.total}>
              <TableCell>Total</TableCell>
              {this.props.report.monthTotals && this.props.report.monthTotals.map( ( m, i ) =>
                <TableCell key={i}>
                  <CurrencyFormat value={m.total} />
                </TableCell>
              )}
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
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
)(withStyles(styles)(ExpensesByCategoryReport));