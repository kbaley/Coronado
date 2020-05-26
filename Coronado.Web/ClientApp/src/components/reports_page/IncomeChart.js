import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { sumBy, orderBy } from 'lodash';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';

export default function IncomeChart() {

  const data = useSelector(state => state.reports.income);
  const incomeReport = data.expenses || [];
  const dispatch = useDispatch();
  const otherThreshold = 0.03;

  React.useEffect(() => {
    if (!data || data.length === 0)
      dispatch(reportActions.loadIncomeReport());
  });

  let report = [];
  const total = sumBy(data.expenses, e => e.total);
  let rest = 0.0;
  incomeReport.map(e => {
    if (e.total / total >= otherThreshold) {
      report.push(Object.assign({percentage: e.total / total}, e));
    } else {
      rest += e.total;
    }
    return e;
  });
  report = orderBy(report, ['total'], ['asc']);
  if (rest > 0) {
    report.push({
      categoryName: "Other",
      total: rest,
      percentage: 0,  // affects the color and I want this to be lighter
    });
  }

  console.log(data);

  const COLORS = ['rgba(70, 130, 180, 1)', 'rgba(70, 130, 180, 0.75)', 'rgba(70, 130, 180, 0.5)', 'rgba(70, 130, 180, 0.25)'];

  const renderLabel = (entry) => {
    return (
      <text
        x={entry.x}
        y={entry.y}
        fill={COLORS[0]}
        textAnchor={entry.textAnchor}
      >
        {entry.categoryName}
      </text>
    );
  }

  return (
    <div style={{ margin: "10px" }}>
      {report && 
      <ResponsiveContainer width="100%" aspect={4.0/3.0}>

        <PieChart
        >
          <Pie 
            isAnimationActive={false}
            dataKey="total" 
            data={report} 
            labelLine={false}
            paddingAngle={1}
            label={renderLabel}
          >
            {
              report.map((entry, index) => {
                let colorIndex = COLORS.length - 1;
                if (entry.percentage > 0.5) {
                  colorIndex = 0;
                } else if (entry.percentage > 0.25) {
                  colorIndex = 1;
                } else if (entry.percentage > 0.1) {
                  colorIndex = 2;
                }
                return(
                <Cell 
                  key={index} 
                  fill={COLORS[colorIndex]}
                />
              )})
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      }
    </div>
  );
}
