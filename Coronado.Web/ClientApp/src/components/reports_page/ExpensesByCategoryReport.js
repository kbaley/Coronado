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
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';

const styles = theme => ({
  total: {
    backgroundColor: theme.palette.gray[2]
  }
});

const useStyles = makeStyles(styles);

export default function ExpensesByCategoryReport() {

  const report = useSelector(state => state.reports.expensesByCategory);

  const getExpense = (expense, month) => {
    var foundExpense = find(expense.amounts, (e) => { return e.date === month.date });
    if (foundExpense)
      return <CurrencyFormat value={foundExpense.amount} />;
    return <span></span>;
  }

  const classes = useStyles();
  return (
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
                <TableCell key={i}>{getExpense(r, m)}</TableCell>
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
  );
}
