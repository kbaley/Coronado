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
  makeStyles, useTheme,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import DateNavigation from './DateNavigation';

const styles = (theme) => ({
  graph: {
  },
});

const useStyles = makeStyles(styles);

export default function NetWorthGraph() {

  const reportData = useSelector(state => state.reports.netWorth);
  const report = reportData.report || [];
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const reportReverse = [...report];
  reportReverse.pop();
  reportReverse.reverse();

  React.useEffect(() => {
    if (!reportData || reportData.length === 0)
      dispatch(reportActions.loadNetWorthReport());
  });

  const goToYear = (year) => {
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
      <DateNavigation goToYear={goToYear} />
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
          <YAxis
            tickFormatter={formatYAxis}
            domain={["auto", "auto"]}
            type='number' />
          <Tooltip formatter={formatTooltip} labelFormatter={formatXAxis} />
          <Bar type="monotone" dataKey="netWorth" fill={theme.palette.blue} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
