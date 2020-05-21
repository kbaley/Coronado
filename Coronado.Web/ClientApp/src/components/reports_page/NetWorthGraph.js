import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { useDispatch, useSelector } from 'react-redux';
import { Currency } from '../common/CurrencyFormat';
import {
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
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

const styles = (theme) => ({
  navigation: {
    width: "100%",
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

export default function NetWorthGraph(props) {

  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const report = useSelector(state => state.reports.netWorth);
  const reportReverse = [...report];
  reportReverse.pop();
  reportReverse.reverse();
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

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM YY');
  };

  const formatYAxis = (tickItem) => {
    return (tickItem / 1000) + "K";
  }

  const formatTooltip = (value, name) => {
    return [Currency(value), "Net worth"];
  }

  const classes = useStyles();
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
      <ResponsiveContainer width="100%" aspect={4.0/3.0}>
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
