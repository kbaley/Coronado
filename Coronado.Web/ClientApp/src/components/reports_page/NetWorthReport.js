import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { useDispatch, useSelector } from 'react-redux';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { CustomTableRow } from '../common/Table';
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
  }
});

const useStyles = makeStyles(styles);

export default function NetWorthReport(props) {

  const dispatch = useDispatch();
  const report = useSelector(state => state.reports.netWorth);

  React.useEffect(() => {
    if (!report || report.length === 0)
      dispatch(reportActions.loadNetWorthReport());
  });
  
  const classes = useStyles();
    return (
      <div style={{margin: "10px"}}>
        <h2>Net Worth</h2>
        <Table className={classes.reportTable}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Net worth</TableCell>
              <TableCell align="right">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.map( (r, index) => {
              const date = moment(r.date).format("MMMM YYYY");
              const value = CurrencyFormat({value: r.netWorth});
              const change = 
                index < report.length - 1 
                ? CurrencyFormat({value: r.netWorth - report[index + 1].netWorth})
                : null;
              return (
                <CustomTableRow
                  key={index}
                  skipFirstCell={true}
                  tableData={[date, value, change]}>
                </CustomTableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    );
}
