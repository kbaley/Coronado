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

export default function NetWorthReport({report}) {

  const classes = useStyles();
  return (
    <Table className={classes.reportTable}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell align="right">Net worth</TableCell>
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
                <CurrencyFormat value={r.netWorth} />
              </TableCell>
              <TableCell>
                {
                  index < report.length - 1
                    ? CurrencyFormat({ value: r.netWorth - report[index + 1].netWorth })
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
