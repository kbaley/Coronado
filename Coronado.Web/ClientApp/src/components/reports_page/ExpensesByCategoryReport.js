import React from 'react';
import { orderBy, find } from 'lodash';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  makeStyles,
  Link,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import ReportApi from '../../api/reportApi';
import TransactionPopup from './TransactionPopup';

const styles = theme => ({
  total: {
    backgroundColor: theme.palette.gray[2]
  },
  link: {
    cursor: "pointer",
  }
});

const useStyles = makeStyles(styles);

export default function ExpensesByCategoryReport() {

  const [ anchorEl, setAnchorEl ] = React.useState(null);
  const [ transactions, setTransactions ] = React.useState([]);
  const report = useSelector(state => state.reports.expensesByCategory);

  const showExpenses = async (expense, month) => {
    const categoryId = expense.categoryId;
    const date = month.date;
    var expenses = await ReportApi.getExpensesForCategoryAndMonth(categoryId, date);
    setTransactions(expenses);
  }

  const doIt = (expense, month, e) => {
    showExpenses(expense, month);
    setAnchorEl(e.currentTarget);
    console.log(e.currentTarget);
  }

  const getExpense = (expense, month) => {
    var foundExpense = find(expense.amounts, (e) => { return e.date === month.date });
    if (foundExpense) {
      return (
        <Link onClick={(e) => doIt(expense, month, e)} className={classes.link}>
        <CurrencyFormat value={foundExpense.amount} />
        </Link>
      );
    }
    return <span></span>;
  }

  const classes = useStyles();

  return (
    <React.Fragment>
      <TransactionPopup
        transactions={transactions}
        target={anchorEl}
        onClose={() => setAnchorEl(null)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Expense</TableCell>
            {report.monthTotals && orderBy(report.monthTotals, ['date'], ['desc']).map((e, i) =>
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
          {report.expenses && report.expenses.map((r, index) =>
            <TableRow
              key={index}
            >
              <TableCell>{r.categoryName}</TableCell>
              {report.monthTotals.map((m, i) =>
                <TableCell key={i}>
                  {getExpense(r, m)}
                </TableCell>
              )}
              <TableCell className={classes.total}><CurrencyFormat value={r.total} /></TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.total}>
            <TableCell>Total</TableCell>
            {report.monthTotals && report.monthTotals.map((m, i) =>
              <TableCell key={i}>
                <CurrencyFormat value={m.total} />
              </TableCell>
            )}
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      </React.Fragment>
  );
}
