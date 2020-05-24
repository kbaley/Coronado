import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { useDispatch } from 'react-redux';
import {
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { sumBy, orderBy } from 'lodash';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

export default function ExpensesByCategoryChart({data}) {

  const otherThreshold = 0.03;
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  let report = [];
  const total = sumBy(data.expenses, e => e.total);
  let rest = 0.0;
  data.expenses.map(e => {
    if (e.total / total >= otherThreshold) {
      report.push(Object.assign({percentage: e.total / total}, e));
    } else {
      rest += e.total;
    }
  });
  report = orderBy(report, ['total'], ['asc']);
  if (rest > 0) {
    report.push({
      categoryName: "Other",
      total: rest,
      percentage: 0,  // affects the color and I want this to be lighter
    });
  }
  console.log(report);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  const COLORS = ['rgba(70, 130, 180, 1)', 'rgba(70, 130, 180, 0.75)', 'rgba(70, 130, 180, 0.5)', 'rgba(70, 130, 180, 0.25)'];

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
      {report && 
      <ResponsiveContainer width="100%" aspect={4.0/3.0}>

        <PieChart
        >
          <Pie 
            isAnimationActive={false} // See https://github.com/recharts/recharts/issues/929
            dataKey="total" 
            data={report} 
            labelLine={false}
            paddingAngle={1}
            label={renderLabel}
          >
            {
              report.map((entry, index) => {
                let colorIndex = COLORS.length - 1;
                if (entry.percentage > 0.1) {
                  colorIndex = 0;
                } else if (entry.percentage > 0.07) {
                  colorIndex = 1;
                } else if (entry.percentage > 0.04) {
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
