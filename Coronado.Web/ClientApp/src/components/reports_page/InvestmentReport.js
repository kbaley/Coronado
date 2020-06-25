import React from 'react';
import { CurrencyFormat } from '../common/CurrencyFormat';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import { useSelector } from 'react-redux';

const styles = (theme) => ({
  reportTable: {
    width: 450,
    clear: "both",
  },
  navigation: {
    width: 450,
    height: 30,
  },
  prevYear: {
    float: "left",
  },
  nextYear: {
    float: "right",
  },
});

const useStyles = makeStyles(styles);

export default function InvestmentReport() {

  const reportData = useSelector(state => state.reports.investment);
  const report = reportData.report || [];

  const classes = useStyles();
  return (
    <Table className={classes.reportTable}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell align="right">Change</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {report.map((r, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                {moment(r.date).format("MMMM YYYY")}
              </TableCell>
              <TableCell>
                <CurrencyFormat value={r.total} />
              </TableCell>
              <TableCell>
                {
                  index < report.length - 1
                    ? <CurrencyFormat value={r.total - report[index + 1].total} />
                    : null
                }
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
