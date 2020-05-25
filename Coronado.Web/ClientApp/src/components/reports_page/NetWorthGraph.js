import React from 'react';
import { Currency } from '../common/CurrencyFormat';
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

export default function NetWorthGraph({report}) {

  const reportReverse = [...report];
  reportReverse.pop();
  reportReverse.reverse();

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM YY');
  };

  const formatYAxis = (tickItem) => {
    return (tickItem / 1000) + "K";
  }

  const formatTooltip = (value, name) => {
    return [Currency(value), "Net worth"];
  }

  return (
    <div style={{ margin: "10px" }}>
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
