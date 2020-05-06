import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderBy, find } from 'lodash';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';
import './ExpensesByCategoryReport.css';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";
import { withStyles, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';

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
    const { classes } = this.props;
    console.log(classes);
    return (
      <div style={{margin: "10px"}}>
        <h4>Expenses By Category</h4>
        <Table
          className={classes.table}>
          <TableHead className={classes.primaryTableHeader}>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Expense</TableCell>
              {this.props.report.monthTotals && orderBy(this.props.report.monthTotals, ['date'], ['desc']).map( ( e, i ) =>
                <TableCell
                  key={i}
                  align="right"
                  className={classes.tableCell + " " + classes.tableHeadCell}
                >
                  <Moment format="MMMM YYYY">{e.date}</Moment>
                </TableCell>
              )}
                <TableCell
                  align="right"
                  className={classes.tableCell + " " + classes.tableHeadCell}
                >Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.report.expenses && this.props.report.expenses.map( (r, index) =>
              <TableRow 
                key={index}
                className={classes.tableBodyRow + " " + classes.expenseRow}
              >
                <TableCell className={classes.tableCell}>{r.categoryName}</TableCell>
                {this.props.report.monthTotals.map( ( m, i ) =>
                <TableCell key={i} className={classes.tableCell}>{this.getExpense(r, m)}</TableCell>
                )}
                <TableCell className={classes.tableCell}><CurrencyFormat value={r.total} /></TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className={classes.primaryTableFooter}>
            <TableRow className={classes.tableRooterRow}>
              <TableCell className={classes.tableCell + " " + classes.tableFooterCell}>Total</TableCell>
              {this.props.report.monthTotals && this.props.report.monthTotals.map( ( m, i ) =>
                <TableCell 
                  className={classes.tableCell + " " + classes.tableFooterCell}
                  key={i}
                >
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
)(withStyles({
  ...styles,
  expenseRow: {
    "& td:last-child": {
      backgroundColor: "#eee"
    }
  }
})(ExpensesByCategoryReport));