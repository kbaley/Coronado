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
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
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

export default function NetWorthReport(props) {

  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const report = useSelector(state => state.reports.netWorth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  React.useEffect(() => {
    if (!report || report.length === 0)
      dispatch(reportActions.loadNetWorthReport());
  });

  const goToPreviousYear = () => {
    goToYear(selectedYear - 1);
  }

  const goToNextYear = () => {
    goToYear(selectedYear + 1);
  }

  const goToYear = (year) => {
    setSelectedYear(year);
    dispatch(reportActions.loadNetWorthReport(year));
  }
  
  const classes = useStyles();
    return (
      <div style={{margin: "10px"}}>
        <h2>Net Worth</h2>
        <div className={classes.navigation}>
          <div className={classes.prevYear}>
            <Button
              onClick={goToPreviousYear}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              {selectedYear - 1}
            </Button>
          </div>
          <div className={classes.nextYear}>
            <Button
              onClick={goToNextYear}
              visible={false}
              endIcon={<KeyboardArrowRightIcon />}
              disabled={selectedYear >= currentYear}
            >
              {selectedYear + 1}
            </Button>
          </div>
        </div>
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
