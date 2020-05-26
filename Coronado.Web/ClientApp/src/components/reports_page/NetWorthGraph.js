import React from 'react';
import { Currency } from '../common/CurrencyFormat';
import * as reportActions from '../../actions/reportActions';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useSelector, useDispatch } from 'react-redux';

const styles = (theme) => ({
  graph: {
  },
  navigation: {
    width: "100%",
    textAlign: "center",
  },
  prevYear: {
    display: "inline-block"
  },
  nextYear: {
    display: "inline-block"
  },
  selectedYearContainer: {
    display: "inline-block",
  },
  selectedYear: {
    fontSize: "30px",
    padding: "6px 20px",
    display: "inline-flex",
    fontWeight: 500,
    verticalAlign: "middle",
  }
});

const useStyles = makeStyles(styles);


export default function NetWorthGraph() {

  const currentYear = new Date().getFullYear();
  const reportData = useSelector(state => state.reports.netWorth);
  const report = reportData.report || [];
  console.log(report);
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const classes = useStyles();
  const reportReverse = [...report];
  reportReverse.pop();
  reportReverse.reverse();

  React.useEffect(() => {
    if (!reportData || reportData.length === 0)
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

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM');
  };

  const formatYAxis = (tickItem) => {
    return (tickItem / 1000) + "K";
  }

  const formatTooltip = (value, name) => {
    return [Currency(value), "Net worth"];
  }

  return (
    <div style={{ margin: "10px" }}>
          <div className={classes.navigation}>
            <div className={classes.prevYear}>
              <Button
                onClick={goToPreviousYear}
                startIcon={<KeyboardArrowLeftIcon />}
              >
                {selectedYear - 1}
              </Button>
            </div>
            <div className={classes.selectedYearContainer}>
              <span className={classes.selectedYear}>
                {selectedYear}
              </span>
            </div>
            <div className={classes.nextYear}>
              <Button
                onClick={goToNextYear}
                endIcon={<KeyboardArrowRightIcon />}
                disabled={selectedYear >= currentYear}
              >
                {selectedYear + 1}
              </Button>
            </div>
          </div>
      <ResponsiveContainer 
        width="100%" 
        className={classes.graph}
        aspect={4.0/3.0}
      >
        <BarChart
          data={reportReverse}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip formatter={formatTooltip} labelFormatter={formatXAxis} />
          <Bar type="monotone" dataKey="netWorth" fill="#4682b4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
